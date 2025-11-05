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
import { Users, Calendar, Crown, Activity, TrendingUp, Shield, Ban, Lock, RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';

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
		bannedUsers: 0,
		activeAdmins: 0,
		totalEventAttendees: 0,
	});
	const [recentUsers, setRecentUsers] = useState<any[]>([]);
	const [recentCommunities, setRecentCommunities] = useState<any[]>([]);
	const [recentEvents, setRecentEvents] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

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
			const [usersSnap, communitiesSnap, eventsSnap] = await Promise.all([
				getDocs(collection(db, 'users')),
				getDocs(collection(db, 'communities')),
				getDocs(collection(db, 'events'))
			]);

			// Filter out deleted communities and events for stats
			const activeCommunities = communitiesSnap.docs.filter(doc => !doc.data().deleted);
			const activeEvents = eventsSnap.docs.filter(doc => !doc.data().deleted);

			// Calculate additional stats
			const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
			const bannedUsers = allUsers.filter((u: any) => u.banned).length;
			const activeAdmins = allUsers.filter((u: any) => u.isAdmin).length;
			
			// Calculate total event attendees
			const totalEventAttendees = activeEvents.reduce((sum, doc) => {
				const eventData = doc.data();
				return sum + (eventData.attendees?.length || 0);
			}, 0);

			setStats({
				totalUsers: usersSnap.size,
				totalCommunities: activeCommunities.length,
				totalEvents: activeEvents.length,
				bannedUsers,
				activeAdmins,
				totalEventAttendees,
			});

			// Load recent users - sort manually since some may not have createdAt
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

			// Load recent events - filter deleted and sort
			const allEvents = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
			const activeEventsList = allEvents.filter((e: any) => !e.deleted);
			activeEventsList.sort((a: any, b: any) => {
				const aTime = a.createdAt?.seconds || 0;
				const bTime = b.createdAt?.seconds || 0;
				return bTime - aTime;
			});
			setRecentEvents(activeEventsList.slice(0, 5));

		} catch (error) {
			console.error('Error loading admin data:', error);
		} finally {
			setLoading(false);
			setCheckingAuth(false);
			setRefreshing(false);
		}
	}

	async function handleRefresh() {
		setRefreshing(true);
		await loadAdminData();
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
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						disabled={refreshing}
						className="gap-2"
					>
						<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
					<Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
						<Shield className="w-4 h-4 mr-2" />
						Admin Access
					</Badge>
				</div>
			}
		>
			{/* Stats Grid */}
			<div id="analytics-section" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-blue-100 text-sm">Total Users</p>
								<p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
								<p className="text-blue-100/80 text-xs mt-2">
									{stats.activeAdmins} admins • {stats.bannedUsers} banned
								</p>
							</div>
							<Users className="h-12 w-12 text-blue-100/50" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-pink-100 text-sm">Active Communities</p>
								<p className="text-3xl font-bold mt-1">{stats.totalCommunities}</p>
								<p className="text-pink-100/80 text-xs mt-2">
									Active communities only
								</p>
							</div>
							<Crown className="h-12 w-12 text-pink-100/50" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-orange-100 text-sm">Active Events</p>
								<p className="text-3xl font-bold mt-1">{stats.totalEvents}</p>
								<p className="text-orange-100/80 text-xs mt-2">
									{stats.totalEventAttendees} total RSVPs
								</p>
							</div>
							<Calendar className="h-12 w-12 text-orange-100/50" />
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Recent Users */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Users className="w-5 h-5 text-blue-600" />
								Recent Users
							</span>
							<Button variant="ghost" size="sm" onClick={() => router.push('/admin/users')}>
								View All
							</Button>
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
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<div className="font-semibold text-gray-800 truncate">{u.name || u.email}</div>
											{u.isAdmin && (
												<Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
													<Shield className="w-3 h-3 mr-1" />
													Admin
												</Badge>
											)}
											{u.banned && (
												<Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 text-xs">
													<Ban className="w-3 h-3 mr-1" />
													Banned
												</Badge>
											)}
										</div>
										<div className="text-sm text-gray-500 truncate">{u.year || 'N/A'} • {u.batch || 'N/A'}</div>
									</div>
								</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Recent Communities */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Crown className="w-5 h-5 text-purple-600" />
								Recent Communities
							</span>
							<Button variant="ghost" size="sm" onClick={() => router.push('/admin/communities')}>
								View All
							</Button>
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
								<div key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/communities/${c.id}`)}>
									<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
										<span className="text-white font-bold text-sm">
											{c.name?.substring(0, 2).toUpperCase() || 'C'}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<div className="font-semibold text-gray-800 truncate">{c.name}</div>
										<div className="text-sm text-gray-500">{c.members?.length || 0} members</div>
									</div>
									<Badge variant="secondary" className="text-xs flex-shrink-0">
										{c.category}
									</Badge>
								</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Recent Events */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Calendar className="w-5 h-5 text-orange-600" />
								Recent Events
							</span>
							<Button variant="ghost" size="sm" onClick={() => router.push('/admin/events')}>
								View All
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{recentEvents.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								<Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
								<p className="text-sm">No events yet</p>
							</div>
						) : (
							<div className="space-y-4">
								{recentEvents.map((e: any) => (
								<div key={e.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/events/${e.id}`)}>
									<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
										<Calendar className="w-6 h-6 text-white" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="font-semibold text-gray-800 truncate">{e.title}</div>
										<div className="text-sm text-gray-500">
											{e.attendees?.length || 0} attendees
										</div>
									</div>
									{e.date && (
										<Badge variant="secondary" className="text-xs flex-shrink-0">
											{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
										</Badge>
									)}
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
						<Button variant="outline" className="h-auto flex-col gap-2 py-6 hover:bg-blue-50 hover:border-blue-300 transition-all" onClick={() => router.push('/admin/users')}>
							<Users className="w-8 h-8 text-blue-600" />
							<span className="font-semibold">Manage Users</span>
							<span className="text-xs text-gray-500">View & edit users</span>
						</Button>
						<Button variant="outline" className="h-auto flex-col gap-2 py-6 hover:bg-purple-50 hover:border-purple-300 transition-all" onClick={() => router.push('/admin/communities')}>
							<Crown className="w-8 h-8 text-purple-600" />
							<span className="font-semibold">Manage Communities</span>
							<span className="text-xs text-gray-500">View & delete communities</span>
						</Button>
						<Button variant="outline" className="h-auto flex-col gap-2 py-6 hover:bg-orange-50 hover:border-orange-300 transition-all" onClick={() => router.push('/admin/events')}>
							<Calendar className="w-8 h-8 text-orange-600" />
							<span className="font-semibold">Manage Events</span>
							<span className="text-xs text-gray-500">View & delete events</span>
						</Button>
						<Button variant="outline" className="h-auto flex-col gap-2 py-6 hover:bg-green-50 hover:border-green-300 transition-all" onClick={() => {
							const analyticsSection = document.getElementById('analytics-section');
							analyticsSection?.scrollIntoView({ behavior: 'smooth' });
						}}>
							<TrendingUp className="w-8 h-8 text-green-600" />
							<span className="font-semibold">View Analytics</span>
							<span className="text-xs text-gray-500">Platform statistics</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* System Status */}
			<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="w-5 h-5 text-indigo-600" />
						System Status
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
							<CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
							<div>
								<div className="font-semibold text-gray-800">Active Users</div>
								<div className="text-sm text-gray-600">{stats.totalUsers - stats.bannedUsers} users</div>
							</div>
						</div>
						<div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200">
							<UserCheck className="w-8 h-8 text-purple-600 flex-shrink-0" />
							<div>
								<div className="font-semibold text-gray-800">Administrators</div>
								<div className="text-sm text-gray-600">{stats.activeAdmins} admins</div>
							</div>
						</div>
						<div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
							<Ban className="w-8 h-8 text-red-600 flex-shrink-0" />
							<div>
								<div className="font-semibold text-gray-800">Banned Users</div>
								<div className="text-sm text-gray-600">{stats.bannedUsers} banned</div>
							</div>
						</div>
						<div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
							<Activity className="w-8 h-8 text-blue-600 flex-shrink-0" />
							<div>
								<div className="font-semibold text-gray-800">Platform Health</div>
								<div className="text-sm text-gray-600">All systems operational</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</PageLayout>
	);
}
