"use client";

import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function UserMenu() {
	const auth = getFirebaseAuth();
	const router = useRouter();
	const user = auth.currentUser;
	const initials = (user?.displayName || user?.email || 'PS').slice(0, 2).toUpperCase();
	async function onSignOut() {
		await signOut(auth);
		router.replace('/login');
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src="" />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{user?.displayName || user?.email}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push(`/profile/${user?.uid}`)}>My Profile</DropdownMenuItem>
				<DropdownMenuItem onClick={onSignOut}>Sign out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
