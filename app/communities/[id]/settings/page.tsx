"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import type { Community } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PageLayout from '@/components/page-layout';
import { toast } from 'sonner';
import { Settings, Save, Loader2 } from 'lucide-react';

export default function CommunitySettingsPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const id = params?.id as string;
	const auth = getFirebaseAuth();
	const [community, setCommunity] = useState<Community | null>(null);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [saving, setSaving] = useState(false);
	const uid = auth.currentUser?.uid;

	useEffect(() => {
		if (!id) return;
		const unsub = onSnapshot(doc(getDb(), 'communities', id), (snap) => {
			if (!snap.exists()) return setCommunity(null);
			const data = snap.data() as Community;
			setCommunity(data);
			setName(data.name);
			setDescription(data.description);
			setCategory(data.category);
		});
		return () => unsub();
	}, [id]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!id) return;
		setSaving(true);
		try {
			await updateDoc(doc(getDb(), 'communities', id), {
				name,
				description,
				category,
			});
			toast.success('Community updated successfully!');
			router.push(`/communities/${id}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to update community');
		} finally {
			setSaving(false);
		}
	}

	if (!community) {
		return (
			<PageLayout title="Settings" description="Loading...">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading community settings...</p>
				</div>
			</PageLayout>
		);
	}

	if (community.createdBy !== uid) {
		return (
			<PageLayout title="Access Denied" description="Only community owners can access settings">
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardContent className="p-12 text-center">
						<h2 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h2>
						<p className="text-gray-600 mb-6">
							You don't have permission to edit this community. Only the community owner can access settings.
						</p>
						<Button onClick={() => router.back()} variant="outline">
							Go Back
						</Button>
					</CardContent>
				</Card>
			</PageLayout>
		);
	}

	return (
		<PageLayout 
			title="Community Settings" 
			description="Edit your community details"
			showBack={true}
			backHref={`/communities/${id}`}
		>
			<div className="max-w-2xl mx-auto">
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-2xl">
							<Settings className="w-6 h-6 text-pink-600" />
							Community Settings
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="name">Community Name *</Label>
								<Input 
									id="name" 
									value={name} 
									onChange={(e) => setName(e.target.value)} 
									required
									className="h-11"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">Category *</Label>
								<Input 
									id="category" 
									value={category} 
									onChange={(e) => setCategory(e.target.value)} 
									required
									placeholder="e.g. Technology, Sports, Music"
									className="h-11"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<Textarea 
									id="description" 
									value={description} 
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Describe your community..."
									rows={6}
									className="resize-none"
								/>
							</div>

							<div className="pt-4 flex gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}
									className="flex-1"
									disabled={saving}
								>
									Cancel
								</Button>
								<Button 
									type="submit" 
									disabled={saving}
									className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
								>
									{saving ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="w-4 h-4 mr-2" />
											Save Changes
										</>
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</PageLayout>
	);
}
