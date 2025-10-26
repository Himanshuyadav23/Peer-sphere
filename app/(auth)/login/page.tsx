"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		try {
			await loginWithEmail(email, password);
			router.push('/dashboard');
		} catch (e: any) {
			toast.error(e.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Welcome back</CardTitle>
				<CardDescription>Only SCSIT DAVV accounts can sign in.</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? 'Signing in...' : 'Sign in'}
					</Button>
					<Button type="button" variant="ghost" className="w-full" onClick={() => router.push('/signup')}>
						Create account
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

