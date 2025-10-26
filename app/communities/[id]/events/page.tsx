"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getDb } from '@/lib/firebase';
import type { EventDoc } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CommunityEventsPage() {
	const params = useParams<{ id: string }>();
	const id = params?.id as string;
	const [events, setEvents] = useState<EventDoc[]>([]);
	useEffect(() => {
		if (!id) return;
		const q = query(collection(getDb(), 'events'), where('communityId', '==', id), orderBy('date'));
		const unsub = onSnapshot(q, (snap) => {
			setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as EventDoc)));
		});
		return () => unsub();
	}, [id]);
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Community Events</h1>
				<Link href="/events/create"><Button size="sm">Create Event</Button></Link>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{events.map((e) => (
					<Card key={e.id}>
						<CardHeader>
							<CardTitle className="line-clamp-1">{e.title}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="text-sm text-muted-foreground line-clamp-3">{e.description}</p>
							<Link href={`/events/${e.id}`}><Button size="sm">View</Button></Link>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
