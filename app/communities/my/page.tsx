"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import type { Community } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Calendar, Plus, Settings, Crown } from 'lucide-react';
import PageLayout from '@/components/page-layout';

export default function MyCommunitiesPage() {
	const auth = getFirebaseAuth();
	const [myCommunities, setMyCommunities] = useState<Community[]>([]);
	const [allCommunities, setAllCommunities] = useState<Community[]>([]);
	const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
	const [loading, setLoading] = useState(true);
	const uid = auth.currentUser?.uid;

	useEffect(() => {
		if (!uid) return;

		// Load my communities
		const q1 = query(
			collection(getDb(), 'communities'),
			where('members', 'array-contains', uid)
		);
		
		const unsub1 = onSnapshot(q1, (snap) => {
			const communities = snap.docs
				.map((d) => ({ id: d.id, ...(d.data() as any) } as Community))
				.filter(c => !c.deleted)
				.sort((a, b) => {
					const aTime = a.createdAt?.seconds || 0;
					const bTime = b.createdAt?.seconds || 0;
					return bTime - aTime;
				});
			setMyCommunities(communities);
		}, (error) => {
			console.error('Error loading my communities:', error);
		});

		// Load all communities
		const unsub2 = onSnapshot(collection(getDb(), 'communities'), (snap) => {
			const communities = snap.docs
				.map((d) => ({ id: d.id, ...(d.data() as any) } as Community))
				.filter(c => !c.deleted)
				.sort((a, b) => {
					const aTime = a.createdAt?.seconds || 0;
					const bTime = b.createdAt?.seconds || 0;
					return bTime - aTime;
				});
			setAllCommunities(communities);
			setLoading(false);
		}, (error) => {
			console.error('Error loading all communities:', error);
			setLoading(false);
		});
		
		return () => {
			unsub1();
			unsub2();
		};
	}, [uid]);

	return (
		<PageLayout 
			title="My Communities" 
			description="Manage and explore your communities"
			showBack={false}
			action={
				<Link href="/communities/create">
					<Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white gap-2">
						<Plus className="h-4 w-4" />
						Create Community
					</Button>
				</Link>
			}
		>
			{/* Tab Navigation */}
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
				<div className="flex gap-2">
					<button
						onClick={() => setActiveTab('my')}
						className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
							activeTab === 'my'
								? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						<Users className="w-4 h-4" />
						My Communities ({myCommunities.length})
					</button>
					<button
						onClick={() => setActiveTab('all')}
						className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
							activeTab === 'all'
								? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						<Crown className="w-4 h-4" />
						All Communities ({allCommunities.length})
					</button>
				</div>
			</div>

			{loading ? (
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading communities...</p>
				</div>
			) : activeTab === 'my' && myCommunities.length === 0 ? (
				<div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
					<div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
						<Users className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-2">No communities yet</h3>
					<p className="text-muted-foreground mb-4">
						You haven't joined any communities yet. Explore existing communities or create your own!
					</p>
					<div className="flex gap-3 justify-center">
						<Link href="/communities">
							<Button variant="outline">Browse Communities</Button>
						</Link>
						<Link href="/communities/create">
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Create Community
							</Button>
						</Link>
					</div>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{(activeTab === 'my' ? myCommunities : allCommunities).map((community) => (
						<Card key={community.id} className="hover:shadow-md transition-shadow">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<CardTitle className="line-clamp-1 text-lg">{community.name}</CardTitle>
											{community.createdBy === uid && (
												<Crown className="h-4 w-4 text-amber-500" />
											)}
										</div>
										<Badge variant="secondary" className="w-fit">
											{community.category}
										</Badge>
									</div>
									<Avatar className="h-10 w-10">
										<AvatarFallback>
											{community.name.substring(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-muted-foreground line-clamp-3">
									{community.description}
								</p>
								
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<Users className="h-4 w-4" />
										{community.members?.length || 0} members
									</div>
									{community.createdAt && (
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											Joined {new Date(community.createdAt.seconds * 1000).toLocaleDateString()}
										</div>
									)}
								</div>

								<div className="flex gap-2">
									<Link href={`/communities/${community.id}`} className="flex-1">
										<Button size="sm" className="w-full">
											View Community
										</Button>
									</Link>
									{community.createdBy === uid && (
										<Link href={`/communities/${community.id}/settings`}>
											<Button size="sm" variant="outline">
												<Settings className="h-4 w-4" />
											</Button>
										</Link>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Quick Actions */}
			{activeTab === 'my' && myCommunities.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-3">
							<Link href="/communities">
								<Button variant="outline" className="gap-2">
									<Users className="h-4 w-4" />
									Browse All Communities
								</Button>
							</Link>
							<Link href="/events">
								<Button variant="outline" className="gap-2">
									<Calendar className="h-4 w-4" />
									View Events
								</Button>
							</Link>
							<Link href="/communities/create">
								<Button variant="outline" className="gap-2">
									<Plus className="h-4 w-4" />
									Create New Community
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			)}
		</PageLayout>
	);
}

