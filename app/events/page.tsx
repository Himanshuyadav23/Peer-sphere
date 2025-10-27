"use client";

import Link from 'next/link';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getDb } from '@/lib/firebase';
import type { EventDoc } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/page-layout';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, Sparkles } from 'lucide-react';

export default function EventsListPage() {
	const [events, setEvents] = useState<EventDoc[]>([]);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		const q = query(collection(getDb(), 'events'), orderBy('date'));
		const unsub = onSnapshot(q, (snap) => {
			setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as EventDoc)));
			setLoading(false);
		}, (error) => {
			console.error('Error loading events:', error);
			setLoading(false);
		});
		return () => unsub();
	}, []);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	};

	return (
		<PageLayout 
			title="Events" 
			description="Discover and join exciting events happening around you"
			action={
				<Link href="/events/create">
					<Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white gap-2">
						<Plus className="h-4 w-4" />
						Create Event
					</Button>
				</Link>
			}
		>
			{loading ? (
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading events...</p>
				</div>
			) : events.length === 0 ? (
				<div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
					<div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
						<Sparkles className="w-6 h-6 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-2">No events yet</h3>
					<p className="text-sm text-muted-foreground mb-6">Be the first to create an event and bring people together!</p>
					<Link href="/events/create">
						<Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white gap-2">
							<Plus className="h-4 w-4" />
							Create First Event
						</Button>
					</Link>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{events.map((event) => (
						<Link key={event.id} href={`/events/${event.id}`}>
							<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer h-full flex flex-col">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-2">
										<CardTitle className="line-clamp-2 text-lg group-hover:text-pink-600 transition-colors">
											{event.title}
										</CardTitle>
										<Badge variant="secondary" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white whitespace-nowrap">
											Event
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-3 flex-1">
									<p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
									
									<div className="space-y-2 pt-2 border-t border-gray-100">
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<CalendarIcon className="w-4 h-4 text-pink-600" />
											<span>{formatDate(event.date)}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Clock className="w-4 h-4 text-purple-600" />
											<span>{event.time}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<MapPin className="w-4 h-4 text-blue-600" />
											<span className="truncate">{event.venue}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Users className="w-4 h-4 text-green-600" />
											<span>{(event.attendees || []).length} attending</span>
										</div>
									</div>

									<Button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
										View Details
									</Button>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</PageLayout>
	);
}

