"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PageLayout from '@/components/page-layout';
import { Users, MessageCircle, Calendar, Crown, Activity, TrendingUp, Shield, Ban, Lock } from 'lucide-react';

export default function AdminPanel() {
	const auth = getFirebaseAuth();
	const router = useRouter();
	const user = auth.currentUser;
	const [isAdmin, setIsAdmin] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true);
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalCommunities: 0,
		totalEvents: 0,
		totalMessages: 0,
	});
	const [recentUsers, setRecentUsers] = useState<any[]>([]);
	const [recentCommunities, setRecentCommunities] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAdminAccess();
	}, []);

	async function checkAdminAccess() {
		if (!user) {
			router.push('/login');
			return;
		}

		try {
			const db = getDb();
			const userDoc = await getDoc(doc(db, 'users', user.uid));
			
			if (userDoc.exists()) {
				const userData = userDoc.data();
				if (userData.isAdmin) {
					setIsAdmin(true);
					loadAdminData();
				} else {
					setIsAdmin(false);
					setCheckingAuth(false);
				}
			} else {
				setIsAdmin(false);
				setCheckingAuth(false);
			}
		} catch (error) {
			console.error('Error checking admin access:', error);
			setIsAdmin(false);
			setCheckingAuth(false);
		}
	}

	async function loadAdminData() {
		try {
			const db = getDb();
			
			// Load stats
			const [usersSnap, communitiesSnap, eventsSnap, messagesSnap] = await Promise.all([
				getDocs(collection(db, 'users')),
				getDocs(collection(db, 'communities')),
				getDocs(collection(db, 'events')),
				getDocs(collection(db, 'messages'))
			]);

			// Filter out deleted communities for stats
			const activeCommunities = communitiesSnap.docs.filter(doc => !doc.data().deleted);

			setStats({
				totalUsers: usersSnap.size,
				totalCommunities: activeCommunities.length,
				totalEvents: eventsSnap.size,
				totalMessages: messagesSnap.size,
			});

			// Load recent users - sort manually since some may not have createdAt
			const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
			allUsers.sort((a: any, b: any) => {
				const aTime = a.createdAt?.seconds || a.updatedAt?.seconds || 0;
				const bTime = b.createdAt?.seconds || b.updatedAt?.seconds || 0;
				return bTime - aTime;
			});
			setRecentUsers(allUsers.slice(0, 5));

			// Load recent communities - sort manually since some may not have createdAt
			const allCommunities = communitiesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
			const activeCommunitiesList = allCommunities.filter((c: any) => !c.deleted);
			activeCommunitiesList.sort((a: any, b: any) => {
				const aTime = a.createdAt?.seconds || 0;
				const bTime = b.createdAt?.seconds || 0;
				return bTime - aTime;
			});
			setRecentCommunities(activeCommunitiesList.slice(0, 5));

		} catch (error) {
			console.error('Error loading admin data:', error);
		} finally {
			setLoading(false);
			setCheckingAuth(false);
		}
	}

	if (checkingAuth) {
		return (
			<PageLayout title="Admin Panel" description="Checking access...">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Verifying admin access...</p>
				</div>
			</PageLayout>
		);
	}

	if (!isAdmin) {
		return (
			<PageLayout title="Access Denied" description="Admin panel access restricted">
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardContent className="p-12 text-center">
						<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<Lock className="w-10 h-10 text-red-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h2>
						<p className="text-gray-600 mb-6">
							You don't have permission to access the admin panel. This area is restricted to administrators only.
						</p>
						<div className="flex gap-3 justify-center">
							<Button
								variant="outline"
								onClick={() => router.back()}
							>
								Go Back
							</Button>
							<Button
								onClick={() => router.push('/dashboard')}
								className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
							>
								Go to Dashboard
							</Button>
						</div>
					</CardContent>
				</Card>
			</PageLayout>
		);
	}

	if (loading) {
		return (
			<PageLayout title="Admin Panel" description="Manage your platform">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading admin data...</p>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout 
			title="Admin Panel" 
			description="Manage users, communities, and content"
			action={
				<Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
					<Shield className="w-4 h-4 mr-2" />
					Admin Access
				</Badge>
			}
		>
			{/* Stats Grid */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-blue-100 text-sm">Total Users</p>
								<p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
							</div>
							<Users className="h-12 w-12 text-blue-100/50" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-pink-100 text-sm">Communities</p>
								<p className="text-3xl font-bold mt-1">{stats.totalCommunities}</p>
							</div>
							<Crown className="h-12 w-12 text-pink-100/50" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-orange-100 text-sm">Events</p>
								<p className="text-3xl font-bold mt-1">{stats.totalEvents}</p>
							</div>
							<Calendar className="h-12 w-12 text-orange-100/50" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-green-100 text-sm">Messages</p>
								<p className="text-3xl font-bold mt-1">{stats.totalMessages}</p>
							</div>
							<MessageCircle className="h-12 w-12 text-green-100/50" />
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Users */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="w-5 h-5 text-blue-600" />
							Recent Users
						</CardTitle>
					</CardHeader>
					<CardContent>
						{recentUsers.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								<Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
								<p className="text-sm">No users yet</p>
							</div>
						) : (
							<div className="space-y-4">
								{recentUsers.map((u: any) => (
								<div key={u.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
									<Avatar>
										<AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
											{u.name?.substring(0, 2).toUpperCase() || 'U'}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="font-semibold text-gray-800">{u.name || u.email}</div>
										<div className="text-sm text-gray-500">{u.year || 'N/A'} • {u.batch || 'N/A'}</div>
									</div>
									{u.createdAt?.seconds && (
										<Badge variant="secondary" className="text-xs">
											{new Date(u.createdAt.seconds * 1000).toLocaleDateString()}
										</Badge>
									)}
								</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Recent Communities */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Crown className="w-5 h-5 text-purple-600" />
							Recent Communities
						</CardTitle>
					</CardHeader>
					<CardContent>
						{recentCommunities.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								<Crown className="w-12 h-12 mx-auto mb-3 text-gray-300" />
								<p className="text-sm">No communities yet</p>
							</div>
						) : (
							<div className="space-y-4">
								{recentCommunities.map((c: any) => (
								<div key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
									<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
										<span className="text-white font-bold text-sm">
											{c.name?.substring(0, 2).toUpperCase() || 'C'}
										</span>
									</div>
									<div className="flex-1">
										<div className="font-semibold text-gray-800">{c.name}</div>
										<div className="text-sm text-gray-500">{c.members?.length || 0} members</div>
									</div>
									<Badge variant="secondary" className="text-xs">
										{c.category}
									</Badge>
								</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="w-5 h-5 text-indigo-600" />
						Quick Actions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<Button variant="outline" className="h-auto flex-col gap-2 py-6">
							<Users className="w-8 h-8 text-blue-600" />
							<span>Manage Users</span>
						</Button>
						<Button variant="outline" className="h-auto flex-col gap-2 py-6">
							<Shield className="w-8 h-8 text-purple-600" />
							<span>Content Moderation</span>
						</Button>
						<Button variant="outline" className="h-auto flex-col gap-2 py-6">
							<TrendingUp className="w-8 h-8 text-green-600" />
							<span>View Analytics</span>
						</Button>
						<Button variant="outline" className="h-auto flex-col gap-2 py-6">
							<Ban className="w-8 h-8 text-red-600" />
							<span>Ban Users</span>
						</Button>
					</div>
				</CardContent>
			</Card>
		</PageLayout>
	);
}
