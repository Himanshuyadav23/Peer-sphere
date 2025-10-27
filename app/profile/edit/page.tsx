"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { updateUserProfile } from '@/lib/users';
import type { UserDoc } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageLayout from '@/components/page-layout';
import { toast } from 'sonner';
import { User, Mail, GraduationCap, Calendar, Heart, Loader2, Save } from 'lucide-react';

const INTEREST_OPTIONS = [
	'Programming', 'Web Development', 'Mobile Apps', 'Data Science', 'AI/ML', 
	'Cybersecurity', 'Cloud Computing', 'IoT', 'Blockchain', 'UI/UX Design',
	'Gaming', 'Music', 'Sports', 'Art', 'Photography', 'Reading', 'Travel', 'Cooking'
];

const YEAR_OPTIONS = ['1st', '2nd', '3rd', 'MCA'] as const;
const BATCH_OPTIONS = ['2021', '2022', '2023', '2024', '2025'];

export default function EditProfilePage() {
	const router = useRouter();
	const auth = getFirebaseAuth();
	const user = auth.currentUser;
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [formData, setFormData] = useState<Partial<UserDoc>>({
		name: '',
		year: '',
		batch: '',
		interests: [],
		avatarUrl: '',
		isAdmin: false,
	});
	const [adminSecret, setAdminSecret] = useState('');

	useEffect(() => {
		if (!user?.uid) {
			toast.error('Not authenticated');
			router.push('/login');
			return;
		}

		loadProfile();
	}, [user]);

	async function loadProfile() {
		if (!user?.uid) return;
		try {
			const snap = await getDoc(doc(getDb(), 'users', user.uid));
			if (snap.exists()) {
				const data = snap.data() as UserDoc;
				setFormData({
					name: data.name || '',
					year: data.year || '',
					batch: data.batch || '',
					interests: data.interests || [],
					avatarUrl: data.avatarUrl || '',
				});
			}
		} catch (error) {
			console.error('Error loading profile:', error);
			toast.error('Failed to load profile');
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!user?.uid) return;

		setSaving(true);
		try {
			// Check if admin secret is provided
			const isAdmin = adminSecret === 'PEERSPHERE_ADMIN_2024';
			const dataToSave = {
				...formData,
				isAdmin: adminSecret ? isAdmin : formData.isAdmin,
			};
			
			await updateUserProfile(user.uid, dataToSave);
			toast.success('Profile updated successfully!');
			router.push(`/profile/${user.uid}`);
		} catch (error: any) {
			toast.error(error.message || 'Failed to update profile');
		} finally {
			setSaving(false);
		}
	}

	function toggleInterest(interest: string) {
		setFormData(prev => ({
			...prev,
			interests: prev.interests?.includes(interest)
				? prev.interests.filter(i => i !== interest)
				: [...(prev.interests || []), interest]
		}));
	}

	if (loading) {
		return (
			<PageLayout title="Edit Profile" description="Loading...">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading profile...</p>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout 
			title="Edit Profile" 
			description="Update your profile information"
			showBack={true}
			backHref={user ? `/profile/${user.uid}` : '/dashboard'}
		>
			<div className="max-w-2xl mx-auto">
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-2xl">
							<User className="w-6 h-6 text-pink-600" />
							Profile Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Name */}
							<div className="space-y-2">
								<Label htmlFor="name" className="flex items-center gap-2">
									<User className="w-4 h-4 text-pink-600" />
									Name *
								</Label>
								<Input 
									id="name" 
									value={formData.name} 
									onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
									required
									className="h-11"
								/>
							</div>

							{/* Email (read-only) */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<Mail className="w-4 h-4 text-gray-400" />
									Email
								</Label>
								<Input 
									value={user?.email || ''} 
									disabled
									className="h-11 bg-gray-100"
								/>
								<p className="text-xs text-gray-500">
									Email cannot be changed
								</p>
							</div>

							{/* Avatar URL */}
							<div className="space-y-2">
								<Label htmlFor="avatarUrl" className="flex items-center gap-2">
									<User className="w-4 h-4 text-purple-600" />
									Avatar URL
								</Label>
								<Input 
									id="avatarUrl" 
									value={formData.avatarUrl} 
									onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} 
									placeholder="https://example.com/avatar.jpg"
									className="h-11"
								/>
							</div>

							{/* Year */}
							<div className="space-y-2">
								<Label htmlFor="year" className="flex items-center gap-2">
									<GraduationCap className="w-4 h-4 text-blue-600" />
									Year *
								</Label>
								<select 
									id="year"
									value={formData.year} 
									onChange={(e) => setFormData({ ...formData, year: e.target.value as any })} 
									required
									className="w-full h-11 rounded-md border border-input bg-background px-3 py-2"
								>
									<option value="">Select Year</option>
									{YEAR_OPTIONS.map(year => (
										<option key={year} value={year}>{year} Year</option>
									))}
								</select>
							</div>

							{/* Batch */}
							<div className="space-y-2">
								<Label htmlFor="batch" className="flex items-center gap-2">
									<Calendar className="w-4 h-4 text-green-600" />
									Batch *
								</Label>
								<select 
									id="batch"
									value={formData.batch} 
									onChange={(e) => setFormData({ ...formData, batch: e.target.value })} 
									required
									className="w-full h-11 rounded-md border border-input bg-background px-3 py-2"
								>
									<option value="">Select Batch</option>
									{BATCH_OPTIONS.map(batch => (
										<option key={batch} value={batch}>{batch}</option>
									))}
								</select>
							</div>

							{/* Admin Secret */}
							<div className="space-y-2">
								<Label htmlFor="adminSecret" className="flex items-center gap-2">
									<Heart className="w-4 h-4 text-red-600" />
									Admin Secret
								</Label>
								<Input 
									id="adminSecret" 
									type="password" 
									value={adminSecret} 
									onChange={(e) => setAdminSecret(e.target.value)} 
									placeholder="Enter secret to get/revoke admin access"
									className="h-11"
								/>
								<p className="text-xs text-gray-500">
									Enter admin secret to become admin. Leave empty to remove admin access.
								</p>
							</div>

							{/* Interests */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<Heart className="w-4 h-4 text-orange-600" />
									Interests
								</Label>
								<div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[100px]">
									{formData.interests?.length === 0 ? (
										<p className="text-sm text-gray-500 w-full">No interests selected</p>
									) : (
										INTEREST_OPTIONS.map(interest => (
											<button
												key={interest}
												type="button"
												onClick={() => toggleInterest(interest)}
												className={`px-3 py-1 rounded-full text-sm transition-colors ${
													formData.interests?.includes(interest)
														? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
														: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
												}`}
											>
												{interest}
											</button>
										))
									)}
								</div>
								<p className="text-xs text-gray-500">
									Click to select/deselect interests
								</p>
							</div>

							{/* Submit Button */}
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
