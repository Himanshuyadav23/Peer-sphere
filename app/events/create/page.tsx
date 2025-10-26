"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';
import { createEvent } from '@/lib/events';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CreateEventPage() {
	const router = useRouter();
	const auth = getFirebaseAuth();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [venue, setVenue] = useState('');
	const [communityId, setCommunityId] = useState('');
	const [saving, setSaving] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const user = auth.currentUser;
		if (!user) return toast.error('Not authenticated');
		setSaving(true);
		try {
			const id = await createEvent({ title, description, date, time, venue, createdBy: user.uid, communityId });
			toast.success('Event created');
			router.push(`/events/${id}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to create');
		} finally {
			setSaving(false);
		}
	}

	return (
		<Card className="max-w-lg">
			<CardHeader>
				<CardTitle>Create Event</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className="space-y-3">
					<div className="space-y-1">
						<Label htmlFor="title">Title</Label>
						<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
					</div>
					<div className="space-y-1">
						<Label htmlFor="description">Description</Label>
						<Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-1">
							<Label htmlFor="date">Date</Label>
							<Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
						</div>
						<div className="space-y-1">
							<Label htmlFor="time">Time</Label>
							<Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
						</div>
					</div>
					<div className="space-y-1">
						<Label htmlFor="venue">Venue</Label>
						<Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
					</div>
					<div className="space-y-1">
						<Label htmlFor="communityId">Community ID</Label>
						<Input id="communityId" value={communityId} onChange={(e) => setCommunityId(e.target.value)} placeholder="target community id" required />
					</div>
					<Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create'}</Button>
				</form>
			</CardContent>
		</Card>
	);
}
