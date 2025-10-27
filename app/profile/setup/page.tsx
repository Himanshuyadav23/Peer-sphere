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
	const [year, setYear] = useState<'1st' | '2nd' | '3rd' | 'MCA' | 'PG Diploma' | ''>('');
	const [course, setCourse] = useState('');
	const [batch, setBatch] = useState('');
	const [interests, setInterests] = useState('');
	const [adminSecret, setAdminSecret] = useState('');
	const [saving, setSaving] = useState(false);

	const COURSE_OPTIONS = [
		'M.Sc. Computer Science',
		'M.Sc. Bioinformatics',
		'M.Sc. Data Science',
		'PG Diploma in Computer Applications',
		'Other'
	];

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
				course: course || undefined,
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
						<Label>Course</Label>
						<Select value={course} onValueChange={(v) => setCourse(v)}>
							<SelectTrigger><SelectValue placeholder="Select your course" /></SelectTrigger>
							<SelectContent>
								{COURSE_OPTIONS.map((option) => (
									<SelectItem key={option} value={option}>{option}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Year</Label>
						<Select value={year} onValueChange={(v) => setYear(v as any)}>
							<SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
							<SelectContent>
								<SelectItem value="1st">1st Year</SelectItem>
								<SelectItem value="2nd">2nd Year</SelectItem>
								<SelectItem value="3rd">3rd Year</SelectItem>
								<SelectItem value="MCA">MCA</SelectItem>
								<SelectItem value="PG Diploma">PG Diploma</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="batch">Batch</Label>
						<Input id="batch" value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="e.g. 2024" required />
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

