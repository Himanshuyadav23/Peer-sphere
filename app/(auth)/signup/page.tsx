"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSCSITEmail, signupWithEmail } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SignupPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isSCSITEmail(email)) {
			toast.error('Use your @davvscsit.in or @scsitdavv.edu email');
			return;
		}
		setLoading(true);
		try {
			await signupWithEmail(email, password, name);
			router.push('/profile/setup');
		} catch (e: any) {
			toast.error(e.message || 'Signup failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Create your account</CardTitle>
				<CardDescription>Allowed: @davvscsit.in or @scsitdavv.edu</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">SCSIT Email</Label>
						<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? 'Creating...' : 'Create account'}
					</Button>
					<Button type="button" variant="ghost" className="w-full" onClick={() => router.push('/login')}>
						Already have an account? Sign in
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

