"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function NotificationsBell() {
	const auth = getFirebaseAuth();
	const [items, setItems] = useState<any[]>([]);
	useEffect(() => {
		const uid = auth.currentUser?.uid;
		if (!uid) return;
		const q = query(collection(getDb(), 'notifications'), where('userId', '==', uid), orderBy('timestamp', 'desc'));
		const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
		return () => unsub();
	}, [auth]);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Bell className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel>Notifications</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{items.length === 0 && <div className="p-3 text-sm text-muted-foreground">No notifications</div>}
				{items.map((n) => (
					<Link key={n.id} href={n.link}>
						<DropdownMenuItem className="text-sm">
							{n.message}
						</DropdownMenuItem>
					</Link>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
