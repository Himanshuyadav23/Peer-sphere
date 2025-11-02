"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/page-layout';
import { Users, Calendar, Heart, UserPlus, RefreshCw, TrendingUp, Activity } from 'lucide-react';

interface ActivityItem {
	id: string;
	type: 'community_join' | 'event_rsvp' | 'profile_update' | 'community_create';
	timestamp: any;
	userId: string;
	userName?: string;
	data: any;
}

export default function HomeFeedPage() {
	const auth = getFirebaseAuth();
	const uid = auth.currentUser?.uid;
	const [activities, setActivities] = useState<ActivityItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!uid) return;

		loadActivityFeed();
	}, [uid]);

	async function loadActivityFeed() {
		if (!uid) return;

		try {
			setLoading(true);
			const db = getDb();

			// Fetch recent activities from different collections
			const [communities, events, users] = await Promise.all([
				getRecentCommunities(db),
				getRecentEvents(db),
				getRecentUsers(db)
			]);

			// Combine and sort by timestamp
			const allActivities = [...communities, ...events, ...users]
				.sort((a, b) => {
					const aTime = a.timestamp?.seconds || 0;
					const bTime = b.timestamp?.seconds || 0;
					return bTime - aTime;
				})
				.slice(0, 20);

			setActivities(allActivities);
		} catch (error) {
			console.error('Error loading activity feed:', error);
		} finally {
			setLoading(false);
		}
	}

	async function getRecentCommunities(db: any) {
		const q = query(collection(db, 'communities'), orderBy('createdAt', 'desc'), limit(10));
		const snap = await getDocs(q);
		
		return snap.docs.map(d => {
			const data = d.data();
			return {
				id: d.id,
				type: 'community_create' as const,
				timestamp: data.createdAt,
				userId: data.createdBy,
				data: { communityName: data.name, communityId: d.id }
			};
		});
	}

	async function getRecentEvents(db: any) {
		const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'), limit(10));
		const snap = await getDocs(q);
		
		return snap.docs.map(d => {
			const data = d.data();
			return {
				id: d.id,
				type: 'event_rsvp' as const,
				timestamp: data.createdAt,
				userId: data.createdBy,
				data: { eventName: data.title, eventId: d.id, date: data.date }
			};
		});
	}

	async function getRecentUsers(db: any) {
		const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(10));
		const snap = await getDocs(q);
		
		return snap.docs.map(d => {
			const data = d.data();
			return {
				id: d.id,
				type: 'profile_update' as const,
				timestamp: data.createdAt,
				userId: d.id,
				data: { userName: data.name }
			};
		});
	}

	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'community_create':
				return <Users className="w-5 h-5 text-purple-600" />;
			case 'event_rsvp':
				return <Calendar className="w-5 h-5 text-blue-600" />;
			case 'profile_update':
				return <UserPlus className="w-5 h-5 text-green-600" />;
			case 'community_join':
				return <Heart className="w-5 h-5 text-pink-600" />;
			default:
				return <Activity className="w-5 h-5 text-gray-600" />;
		}
	};

	const getActivityMessage = (activity: ActivityItem) => {
		switch (activity.type) {
			case 'community_create':
				return `created a new community`;
			case 'event_rsvp':
				return `created an event`;
			case 'profile_update':
				return `joined Peer Sphere`;
			case 'community_join':
				return `joined a community`;
			default:
				return 'performed an activity';
		}
	};

	const formatTimestamp = (timestamp: any) => {
		if (!timestamp) return '';
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days}d ago`;
		if (hours > 0) return `${hours}h ago`;
		if (minutes > 0) return `${minutes}m ago`;
		return 'just now';
	};

	if (loading) {
		return (
			<PageLayout title="Activity Feed" description="See what's happening in your network">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading activity...</p>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout 
			title="Activity Feed" 
			description="See what's happening in your network"
			action={
				<Button variant="outline" size="sm" onClick={loadActivityFeed}>
					<RefreshCw className="w-4 h-4 mr-2" />
					Refresh
				</Button>
			}
		>
			{activities.length === 0 ? (
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardContent className="p-12 text-center">
						<TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
						<p className="text-gray-500">No recent activity</p>
						<p className="text-sm text-gray-400 mt-2">Check back later for updates</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{activities.map((activity) => (
						<Card key={activity.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
							<CardContent className="p-4">
								<div className="flex items-start gap-4">
									<Avatar>
										<AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
											{activity.userName?.substring(0, 2).toUpperCase() || 'U'}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-semibold text-gray-800">
												{activity.userName || 'Someone'}
											</span>
											<span className="text-gray-500">
												{getActivityMessage(activity)}
											</span>
										</div>
										{activity.type === 'community_create' && (
											<div className="flex items-center gap-2 mt-2">
												<Badge className="bg-purple-100 text-purple-700">
													{activity.data.communityName}
												</Badge>
											</div>
										)}
										{activity.type === 'event_rsvp' && (
											<div className="flex items-center gap-2 mt-2">
												<Badge className="bg-blue-100 text-blue-700">
													{activity.data.eventName}
												</Badge>
												{activity.data.date && (
													<span className="text-xs text-gray-500">
														{new Date(activity.data.date).toLocaleDateString()}
													</span>
												)}
											</div>
										)}
										<div className="text-xs text-gray-400 mt-2">
											{formatTimestamp(activity.timestamp)}
										</div>
									</div>
									<div className="flex items-center">
										{getActivityIcon(activity.type)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</PageLayout>
	);
}

