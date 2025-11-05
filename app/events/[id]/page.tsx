"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import type { EventDoc } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PageLayout from '@/components/page-layout';
import { rsvpEvent, cancelRsvp, deleteEvent } from '@/lib/events';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Clock, MapPin, Users, CheckCircle2, X, Trash2 } from 'lucide-react';

export default function EventDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const id = params?.id as string;
	const auth = getFirebaseAuth();
	const [eventDoc, setEventDoc] = useState<EventDoc | null>(null);
	const [loading, setLoading] = useState(true);
	const [rsvpLoading, setRsvpLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const uid = auth.currentUser?.uid;
	const hasRsvped = useMemo(() => !!(eventDoc?.attendees || []).includes(uid || ''), [eventDoc, uid]);
	const isCreator = useMemo(() => eventDoc?.createdBy === uid, [eventDoc, uid]);

	useEffect(() => {
		if (!id) return;
		const unsub = onSnapshot(doc(getDb(), 'events', id), (snap) => {
			if (!snap.exists()) {
				setEventDoc(null);
				setLoading(false);
				return;
			}
			setEventDoc({ id: snap.id, ...(snap.data() as any) } as EventDoc);
			setLoading(false);
		}, (error) => {
			console.error('Error loading event:', error);
			setLoading(false);
		});
		return () => unsub();
	}, [id]);

	useEffect(() => {
		async function checkAdmin() {
			if (!uid) return;
			try {
				const db = getDb();
				const userDoc = await getDoc(doc(db, 'users', uid));
				if (userDoc.exists()) {
					setIsAdmin(userDoc.data().isAdmin || false);
				}
			} catch (error) {
				console.error('Error checking admin status:', error);
			}
		}
		checkAdmin();
	}, [uid]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
	};

	async function onToggleRsvp() {
		if (!uid || !id) return toast.error('Not authenticated');
		setRsvpLoading(true);
		try {
			if (hasRsvped) {
				await cancelRsvp(id, uid);
				toast.success('RSVP cancelled');
			} else {
				await rsvpEvent(id, uid);
				toast.success('Successfully RSVP\'d!');
			}
		} catch (e: any) {
			toast.error(e.message || 'Failed');
		} finally {
			setRsvpLoading(false);
		}
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
			return;
		}
		
		setDeleteLoading(true);
		try {
			await deleteEvent(id);
			toast.success('Event deleted successfully');
			router.push('/events');
		} catch (e: any) {
			toast.error(e.message || 'Failed to delete event');
		} finally {
			setDeleteLoading(false);
		}
	}

	if (loading) {
		return (
			<PageLayout title="Event Details" description="Loading...">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading event details...</p>
				</div>
			</PageLayout>
		);
	}

	if (!eventDoc) {
		return (
			<PageLayout title="Event Not Found" description="The event you're looking for doesn't exist">
				<div className="text-center py-12">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<X className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold mb-2">Event not found</h3>
					<p className="text-sm text-muted-foreground mb-6">This event may have been deleted or doesn't exist.</p>
					<Button onClick={() => router.back()} variant="outline">
						Go Back
					</Button>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout 
			title={eventDoc.title}
			description="Event details and RSVP"
			showBack={true}
			backHref="/events"
			action={
				<div className="flex gap-2">
					{(isCreator || isAdmin) && (
						<Button
							onClick={handleDelete}
							disabled={deleteLoading}
							variant="destructive"
							className="gap-2"
						>
							<Trash2 className="h-4 w-4" />
							{deleteLoading ? 'Deleting...' : 'Delete'}
						</Button>
					)}
					<Button
						onClick={onToggleRsvp}
						disabled={rsvpLoading}
						className={hasRsvped 
							? "bg-green-600 hover:bg-green-700 text-white gap-2" 
							: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white gap-2"
						}
					>
						{hasRsvped ? (
							<>
								<CheckCircle2 className="h-4 w-4" />
								RSVP'd
							</>
						) : (
							<>
								<CalendarIcon className="h-4 w-4" />
								RSVP Now
							</>
						)}
					</Button>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Description */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle>About This Event</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{eventDoc.description}</p>
					</CardContent>
				</Card>

				{/* Event Details */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle>Event Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-start gap-4">
							<div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
								<CalendarIcon className="w-6 h-6 text-white" />
							</div>
							<div className="flex-1">
								<div className="text-sm text-gray-500 mb-1">Date</div>
								<div className="font-semibold text-gray-800">{formatDate(eventDoc.date)}</div>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
								<Clock className="w-6 h-6 text-white" />
							</div>
							<div className="flex-1">
								<div className="text-sm text-gray-500 mb-1">Time</div>
								<div className="font-semibold text-gray-800">{eventDoc.time}</div>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
								<MapPin className="w-6 h-6 text-white" />
							</div>
							<div className="flex-1">
								<div className="text-sm text-gray-500 mb-1">Venue</div>
								<div className="font-semibold text-gray-800">{eventDoc.venue}</div>
							</div>
						</div>

						<div className="flex items-start gap-4 pt-4 border-t border-gray-100">
							<div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
								<Users className="w-6 h-6 text-white" />
							</div>
							<div className="flex-1">
								<div className="text-sm text-gray-500 mb-1">Attendees</div>
								<div className="font-semibold text-gray-800 text-2xl">{(eventDoc.attendees || []).length}</div>
								<div className="text-xs text-gray-500 mt-1">people have RSVP'd</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Attendees List */}
				{(eventDoc.attendees || []).length > 0 && (
					<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="w-5 h-5" />
								Attendees ({eventDoc.attendees.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
								{eventDoc.attendees.map((attendeeId, index) => (
									<div key={index} className="flex flex-col items-center gap-2">
										<Avatar className="w-12 h-12 border-2 border-white shadow-lg">
											<AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold">
												{attendeeId.substring(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										{hasRsvped && attendeeId === uid && (
											<Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
												You
											</Badge>
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</PageLayout>
	);
}
