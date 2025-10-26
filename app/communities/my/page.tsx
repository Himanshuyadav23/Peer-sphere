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

export default function MyCommunitiesPage() {
	const auth = getFirebaseAuth();
	const [myCommunities, setMyCommunities] = useState<Community[]>([]);
	const [loading, setLoading] = useState(true);
	const uid = auth.currentUser?.uid;

	useEffect(() => {
		if (!uid) return;

		const q = query(
			collection(getDb(), 'communities'),
			where('members', 'array-contains', uid),
			where('deleted', '!=', true)
		);
		
		const unsub = onSnapshot(q, (snap) => {
			setMyCommunities(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Community)));
			setLoading(false);
		});
		
		return () => unsub();
	}, [uid]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading your communities...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">My Communities</h1>
					<p className="text-muted-foreground">Manage and explore your communities</p>
				</div>
				<Link href="/communities/create">
					<Button className="gap-2">
						<Plus className="h-4 w-4" />
						Create Community
					</Button>
				</Link>
			</div>

			{myCommunities.length === 0 ? (
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
					{myCommunities.map((community) => (
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
			{myCommunities.length > 0 && (
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
		</div>
	);
}

