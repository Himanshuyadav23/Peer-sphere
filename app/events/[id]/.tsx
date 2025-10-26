"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import type { EventDoc } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { rsvpEvent } from '@/lib/events';
import { toast } from 'sonner';

export default function EventDetailPage() {
	const params = useParams<{ id: string }>();
	const id = params?.id as string;
	const auth = getFirebaseAuth();
	const [eventDoc, setEventDoc] = useState<EventDoc | null>(null);
	const uid = auth.currentUser?.uid;
	const hasRsvped = useMemo(() => !!(eventDoc?.attendees || []).includes(uid || ''), [eventDoc, uid]);
	useEffect(() => {
		if (!id) return;
		const unsub = onSnapshot(doc(getDb(), 'events', id), (snap) => {
			if (!snap.exists()) return setEventDoc(null);
			setEventDoc({ id: snap.id, ...(snap.data() as any) } as EventDoc);
		});
		return () => unsub();
	}, [id]);

	async function onRsvp() {
		if (!uid || !id) return;
		try {
			await rsvpEvent(id, uid);
		} catch (e: any) {
			toast.error(e.message || 'Failed');
		}
	}

	if (!eventDoc) return <div className="p-4">Loading...</div>;
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">{eventDoc.title}</h1>
				<Button onClick={onRsvp} disabled={hasRsvped}>{hasRsvped ? 'RSVP’d' : 'RSVP'}</Button>
			</div>
			<p className="text-muted-foreground">{eventDoc.description}</p>
			<Card>
				<CardHeader>
					<CardTitle>Details</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-2 sm:grid-cols-2">
					<div><span className="font-medium">Date:</span> {eventDoc.date}</div>
					<div><span className="font-medium">Time:</span> {eventDoc.time}</div>
					<div><span className="font-medium">Venue:</span> {eventDoc.venue}</div>
					<div><span className="font-medium">Attendees:</span> {(eventDoc.attendees || []).length}</div>
				</CardContent>
			</Card>
		</div>
	);
}
