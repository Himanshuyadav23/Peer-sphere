"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import type { Community, EventDoc } from '@/lib/types';
import { getTopMatches } from '@/lib/matchmaking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function DashboardPage() {
	const auth = getFirebaseAuth();
	const uid = auth.currentUser?.uid;
	const [myCommunities, setMyCommunities] = useState<Community[]>([]);
	const [upcomingEvents, setUpcomingEvents] = useState<EventDoc[]>([]);
	const [matches, setMatches] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!uid) return;

		// Load my communities
		const q1 = query(
			collection(getDb(), 'communities'),
			where('members', 'array-contains', uid),
			limit(5)
		);
		const unsub1 = onSnapshot(q1, (snap) => {
			setMyCommunities(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Community)));
		});

		// Load upcoming events
		const q2 = query(collection(getDb(), 'events'), limit(5));
		const unsub2 = onSnapshot(q2, (snap) => {
			setUpcomingEvents(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as EventDoc)));
		});

		// Load matches
		getTopMatches(uid, 5).then(setMatches).catch(console.error);

		setLoading(false);
		return () => {
			unsub1();
			unsub2();
		};
	}, [uid]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
					<Sparkles className="w-8 h-8 text-white" />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 p-6">
			<div>
				<h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
					Welcome Back!
				</h1>
				<p className="text-gray-600 mt-2">Here's what's happening in your communities</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* My Communities */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Users className="w-5 h-5 text-pink-600" />
								My Communities
							</CardTitle>
							<Link href="/communities/my">
								<Button variant="ghost" size="sm">View All</Button>
							</Link>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						{myCommunities.length === 0 ? (
							<div className="text-center py-8">
								<p className="text-gray-500 mb-4">No communities yet</p>
								<Link href="/communities/create">
									<Button size="sm">Create Community</Button>
								</Link>
							</div>
						) : (
							myCommunities.map((community) => (
								<Link key={community.id} href={`/communities/${community.id}`}>
									<div className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-colors">
										<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
											<span className="text-white font-bold">
												{community.name.substring(0, 2).toUpperCase()}
											</span>
										</div>
										<div className="flex-1">
											<div className="font-semibold text-gray-800">{community.name}</div>
											<div className="text-sm text-gray-500">{community.members?.length || 0} members</div>
										</div>
									</div>
								</Link>
							))
						)}
					</CardContent>
				</Card>

				{/* Upcoming Events */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Calendar className="w-5 h-5 text-blue-600" />
								Upcoming Events
							</CardTitle>
							<Link href="/events">
								<Button variant="ghost" size="sm">View All</Button>
							</Link>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						{upcomingEvents.length === 0 ? (
							<div className="text-center py-8">
								<p className="text-gray-500 mb-4">No upcoming events</p>
								<Link href="/events/create">
									<Button size="sm">Create Event</Button>
								</Link>
							</div>
						) : (
							upcomingEvents.map((event) => (
								<Link key={event.id} href={`/events/${event.id}`}>
									<div className="p-3 rounded-xl hover:bg-blue-50 transition-colors">
										<div className="font-semibold text-gray-800">{event.title}</div>
										<div className="text-sm text-gray-500 mt-1">
											{new Date(event.date).toLocaleDateString()} at {event.time}
										</div>
										{event.attendees && (
											<div className="text-sm text-gray-500 mt-1">
												{event.attendees.length} attending
											</div>
										)}
									</div>
								</Link>
							))
						)}
					</CardContent>
				</Card>
			</div>

			{/* Top Matches */}
			<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Heart className="w-5 h-5 text-red-600" />
							Top Matches
						</CardTitle>
						<Link href="/matches">
							<Button variant="ghost" size="sm">View All Matches</Button>
						</Link>
					</div>
				</CardHeader>
				<CardContent>
					{matches.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-500">Complete your profile to find matches</p>
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{matches.map((match) => (
								<Link key={match.uid} href={`/profile/${match.uid}`}>
									<div className="p-4 rounded-xl hover:bg-pink-50 transition-colors border border-white/20">
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
													{match.name.substring(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="font-semibold text-gray-800">{match.name}</div>
												<div className="text-sm text-gray-500">{match.year} • {match.batch}</div>
											</div>
											<Badge variant="secondary" className="bg-green-100 text-green-700">
												{match.score} matches
											</Badge>
										</div>
										<div className="flex flex-wrap gap-2 mt-3">
											{match.interests?.slice(0, 3).map((interest: string, i: number) => (
												<Badge key={i} variant="secondary" className="text-xs">
													{interest}
												</Badge>
											))}
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Link href="/communities/create">
					<Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105">
						<CardContent className="p-6 text-center">
							<Users className="w-12 h-12 mx-auto mb-3" />
							<div className="font-semibold">Create Community</div>
						</CardContent>
					</Card>
				</Link>
				<Link href="/events/create">
					<Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105">
						<CardContent className="p-6 text-center">
							<Calendar className="w-12 h-12 mx-auto mb-3" />
							<div className="font-semibold">Create Event</div>
						</CardContent>
					</Card>
				</Link>
				<Link href="/matches">
					<Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105">
						<CardContent className="p-6 text-center">
							<Heart className="w-12 h-12 mx-auto mb-3" />
							<div className="font-semibold">Find Matches</div>
						</CardContent>
					</Card>
				</Link>
				<Link href="/messages">
					<Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105">
						<CardContent className="p-6 text-center">
							<MessageCircle className="w-12 h-12 mx-auto mb-3" />
							<div className="font-semibold">Messages</div>
						</CardContent>
					</Card>
				</Link>
			</div>
		</div>
	);
}
