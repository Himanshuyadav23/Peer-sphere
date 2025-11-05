"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import type { Community, EventDoc, UserDoc } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PageLayout from '@/components/page-layout';
import { Users, Calendar, Crown, Search, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = searchParams.get('q') || '';
	const [results, setResults] = useState<{
		users: UserDoc[];
		communities: Community[];
		events: EventDoc[];
	}>({
		users: [],
		communities: [],
		events: [],
	});
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<'all' | 'users' | 'communities' | 'events'>('all');

	useEffect(() => {
		if (query) {
			performSearch(query);
		} else {
			setLoading(false);
		}
	}, [query]);

	async function performSearch(searchQuery: string) {
		if (!searchQuery.trim()) {
			setResults({ users: [], communities: [], events: [] });
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const db = getDb();
			const q = searchQuery.toLowerCase();

			// Search users
			const usersSnap = await getDocs(collection(db, 'users'));
			const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as UserDoc));
			const matchedUsers = allUsers.filter((u: any) => {
				if (u.banned) return false;
				return (
					u.name?.toLowerCase().includes(q) ||
					u.email?.toLowerCase().includes(q) ||
					u.year?.toLowerCase().includes(q) ||
					u.batch?.toLowerCase().includes(q) ||
					u.course?.toLowerCase().includes(q) ||
					u.interests?.some((i: string) => i.toLowerCase().includes(q))
				);
			});

			// Search communities
			const communitiesSnap = await getDocs(collection(db, 'communities'));
			const allCommunities = communitiesSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Community));
			const matchedCommunities = allCommunities.filter((c: any) => {
				if (c.deleted) return false;
				return (
					c.name?.toLowerCase().includes(q) ||
					c.description?.toLowerCase().includes(q) ||
					c.category?.toLowerCase().includes(q)
				);
			});

			// Search events
			const eventsSnap = await getDocs(collection(db, 'events'));
			const allEvents = eventsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as EventDoc));
			const matchedEvents = allEvents.filter((e: any) => {
				if (e.deleted) return false;
				return (
					e.title?.toLowerCase().includes(q) ||
					e.description?.toLowerCase().includes(q) ||
					e.venue?.toLowerCase().includes(q)
				);
			});

			setResults({
				users: matchedUsers,
				communities: matchedCommunities,
				events: matchedEvents,
			});
		} catch (error) {
			console.error('Error performing search:', error);
		} finally {
			setLoading(false);
		}
	}

	const totalResults = results.users.length + results.communities.length + results.events.length;

	const displayUsers = activeTab === 'all' || activeTab === 'users' ? results.users : [];
	const displayCommunities = activeTab === 'all' || activeTab === 'communities' ? results.communities : [];
	const displayEvents = activeTab === 'all' || activeTab === 'events' ? results.events : [];

	return (
		<PageLayout
			title="Search Results"
			description={query ? `Searching for "${query}"` : 'Search across the platform'}
			showBack={true}
			backHref="/dashboard"
		>
			{!query ? (
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardContent className="p-12 text-center">
						<Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
						<h3 className="text-xl font-bold text-gray-800 mb-2">Enter a search query</h3>
						<p className="text-gray-600">Use the search bar in the header to search for users, communities, and events.</p>
					</CardContent>
				</Card>
			) : loading ? (
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Searching...</p>
				</div>
			) : totalResults === 0 ? (
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardContent className="p-12 text-center">
						<Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
						<h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
						<p className="text-gray-600 mb-4">Try adjusting your search terms.</p>
						<Button onClick={() => router.push('/dashboard')} variant="outline">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Go to Dashboard
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-6">
					{/* Tab Navigation */}
					<div className="flex gap-2 overflow-x-auto pb-2">
						<Button
							variant={activeTab === 'all' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setActiveTab('all')}
							className="whitespace-nowrap"
						>
							All ({totalResults})
						</Button>
						<Button
							variant={activeTab === 'users' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setActiveTab('users')}
							className="whitespace-nowrap"
						>
							<User className="w-4 h-4 mr-2" />
							Users ({results.users.length})
						</Button>
						<Button
							variant={activeTab === 'communities' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setActiveTab('communities')}
							className="whitespace-nowrap"
						>
							<Crown className="w-4 h-4 mr-2" />
							Communities ({results.communities.length})
						</Button>
						<Button
							variant={activeTab === 'events' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setActiveTab('events')}
							className="whitespace-nowrap"
						>
							<Calendar className="w-4 h-4 mr-2" />
							Events ({results.events.length})
						</Button>
					</div>

					{/* Users Results */}
					{displayUsers.length > 0 && (
						<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<User className="w-5 h-5 text-blue-600" />
									Users ({results.users.length})
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{displayUsers.map((user) => (
										<Link key={user.uid} href={`/profile/${user.uid}`}>
											<Card className="hover:shadow-lg transition-all cursor-pointer">
												<CardContent className="p-4">
													<div className="flex items-center gap-3">
														<Avatar>
															<AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
																{user.name?.substring(0, 2).toUpperCase() || 'U'}
															</AvatarFallback>
														</Avatar>
														<div className="flex-1 min-w-0">
															<div className="font-semibold text-gray-800 truncate">{user.name}</div>
															<div className="text-sm text-gray-500 truncate">{user.year} • {user.batch}</div>
														</div>
													</div>
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Communities Results */}
					{displayCommunities.length > 0 && (
						<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Crown className="w-5 h-5 text-purple-600" />
									Communities ({results.communities.length})
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{displayCommunities.map((community) => (
										<Link key={community.id} href={`/communities/${community.id}`}>
											<Card className="hover:shadow-lg transition-all cursor-pointer">
												<CardContent className="p-4">
													<div className="flex items-center gap-3">
														<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
															<span className="text-white font-bold text-sm">
																{community.name?.substring(0, 2).toUpperCase() || 'C'}
															</span>
														</div>
														<div className="flex-1 min-w-0">
															<div className="font-semibold text-gray-800 truncate">{community.name}</div>
															<div className="text-sm text-gray-500">{community.members?.length || 0} members</div>
														</div>
														<Badge variant="secondary" className="text-xs flex-shrink-0">
															{community.category}
														</Badge>
													</div>
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Events Results */}
					{displayEvents.length > 0 && (
						<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="w-5 h-5 text-orange-600" />
									Events ({results.events.length})
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{displayEvents.map((event) => (
										<Link key={event.id} href={`/events/${event.id}`}>
											<Card className="hover:shadow-lg transition-all cursor-pointer">
												<CardContent className="p-4">
													<div className="space-y-2">
														<div className="font-semibold text-gray-800 line-clamp-2">{event.title}</div>
														<div className="text-sm text-gray-500">
															{new Date(event.date).toLocaleDateString()} at {event.time}
														</div>
														<div className="flex items-center gap-2 text-sm text-gray-500">
															<Users className="w-4 h-4" />
															{event.attendees?.length || 0} attendees
														</div>
													</div>
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</PageLayout>
	);
}

