"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Smartphone } from 'lucide-react';

export default function UserMenu() {
	const auth = getFirebaseAuth();
	const router = useRouter();
	const user = auth.currentUser;
	const [avatarUrl, setAvatarUrl] = useState<string>('');
	const initials = (user?.displayName || user?.email || 'PS').slice(0, 2).toUpperCase();
	
	useEffect(() => {
		if (!user?.uid) return;
		getDoc(doc(getDb(), 'users', user.uid)).then(snap => {
			if (snap.exists()) {
				const data = snap.data();
				if (data?.avatarUrl) setAvatarUrl(data.avatarUrl);
			}
		}).catch(console.error);
	}, [user]);

	async function onSignOut() {
		await signOut(auth);
		router.replace('/login');
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={avatarUrl} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{user?.displayName || user?.email}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push(`/profile/${user?.uid}`)}>My Profile</DropdownMenuItem>
				<DropdownMenuItem onClick={() => router.push('/mobile-app')}>
					<Smartphone className="mr-2 h-4 w-4" />
					Mobile App
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={onSignOut}>Sign out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
