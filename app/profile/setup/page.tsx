"use client";

import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
	const router = useRouter();
	const auth = getFirebaseAuth();
	const db = getDb();
	const [name, setName] = useState('');
	const [year, setYear] = useState<'1st' | '2nd' | '3rd' | 'MCA' | ''>('');
	const [batch, setBatch] = useState('');
	const [interests, setInterests] = useState('');
	const [adminSecret, setAdminSecret] = useState('');
	const [saving, setSaving] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const user = auth.currentUser;
		if (!user) {
			toast.error('Not authenticated');
			return;
		}
		setSaving(true);
		try {
			console.log('Saving profile for user:', user.uid);
			const isAdmin = adminSecret === 'PEERSPHERE_ADMIN_2024';
			
			const profileData = {
				uid: user.uid,
				name,
				email: user.email,
				year,
				batch,
				interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
				isAdmin: isAdmin || false,
				updatedAt: serverTimestamp(),
			};
			console.log('Profile data:', profileData);
			await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
			console.log('Profile saved successfully');
			toast.success('Profile saved');
			router.push('/');
		} catch (e: any) {
			console.error('Error saving profile:', e);
			toast.error(e.message || 'Failed to save');
		} finally {
			setSaving(false);
		}
	}

	return (
		<Card className="w-full max-w-lg">
			<CardHeader>
				<CardTitle>Complete your profile</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
					</div>
					<div className="space-y-2">
						<Label>Year</Label>
						<Select value={year} onValueChange={(v) => setYear(v as any)}>
							<SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
							<SelectContent>
								<SelectItem value="1st">1st</SelectItem>
								<SelectItem value="2nd">2nd</SelectItem>
								<SelectItem value="3rd">3rd</SelectItem>
								<SelectItem value="MCA">MCA</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="batch">Batch</Label>
						<Input id="batch" value={batch} onChange={(e) => setBatch(e.target.value)} required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="interests">Skills/Interests</Label>
						<Input id="interests" placeholder="e.g. React, ML, UI/UX" value={interests} onChange={(e) => setInterests(e.target.value)} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="adminSecret">Admin Secret (Optional)</Label>
						<Input 
							id="adminSecret" 
							type="password" 
							placeholder="Enter admin secret to become admin" 
							value={adminSecret} 
							onChange={(e) => setAdminSecret(e.target.value)} 
						/>
						<p className="text-xs text-gray-500">Leave empty for regular user</p>
					</div>
					<Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
				</form>
			</CardContent>
		</Card>
	);
}

