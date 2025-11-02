"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import PageLayout from '@/components/page-layout';
import { Users, Shield, Ban, Check, ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
	const auth = getFirebaseAuth();
	const router = useRouter();
	const user = auth.currentUser;
	const [isAdmin, setIsAdmin] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true);
	const [users, setUsers] = useState<any[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAdminAccess();
	}, []);

	useEffect(() => {
		// Filter users based on search query
		if (!searchQuery.trim()) {
			setFilteredUsers(users);
		} else {
			const query = searchQuery.toLowerCase();
			setFilteredUsers(
				users.filter(u => 
					u.name?.toLowerCase().includes(query) || 
					u.email?.toLowerCase().includes(query) ||
					u.year?.toLowerCase().includes(query) ||
					u.batch?.toLowerCase().includes(query)
				)
			);
		}
	}, [searchQuery, users]);

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
					loadUsers();
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

	async function loadUsers() {
		try {
			setLoading(true);
			const db = getDb();
			const usersSnap = await getDocs(collection(db, 'users'));
			
			const usersList = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
			// Sort by created date
			usersList.sort((a: any, b: any) => {
				const aTime = a.createdAt?.seconds || a.updatedAt?.seconds || 0;
				const bTime = b.createdAt?.seconds || b.updatedAt?.seconds || 0;
				return bTime - aTime;
			});

			setUsers(usersList);
			setFilteredUsers(usersList);
		} catch (error) {
			console.error('Error loading users:', error);
			toast.error('Failed to load users');
		} finally {
			setLoading(false);
			setCheckingAuth(false);
		}
	}

	async function toggleAdmin(userId: string, currentStatus: boolean) {
		if (!confirm(`Are you sure you want to ${currentStatus ? 'remove' : 'grant'} admin access for this user?`)) {
			return;
		}

		try {
			const db = getDb();
			await updateDoc(doc(db, 'users', userId), {
				isAdmin: !currentStatus,
			});

			toast.success(`${currentStatus ? 'Removed' : 'Granted'} admin access`);
			loadUsers();
		} catch (error) {
			console.error('Error toggling admin:', error);
			toast.error('Failed to update admin status');
		}
	}

	async function banUser(userId: string, userName: string) {
		if (!confirm(`Are you sure you want to ban ${userName}? This will prevent them from accessing the platform.`)) {
			return;
		}

		try {
			const db = getDb();
			await updateDoc(doc(db, 'users', userId), {
				banned: true,
				bannedAt: new Date(),
			});

			toast.success(`User ${userName} has been banned`);
			loadUsers();
		} catch (error) {
			console.error('Error banning user:', error);
			toast.error('Failed to ban user');
		}
	}

	async function unbanUser(userId: string, userName: string) {
		if (!confirm(`Are you sure you want to unban ${userName}?`)) {
			return;
		}

		try {
			const db = getDb();
			await updateDoc(doc(db, 'users', userId), {
				banned: false,
				bannedAt: null,
			});

			toast.success(`User ${userName} has been unbanned`);
			loadUsers();
		} catch (error) {
			console.error('Error unbanning user:', error);
			toast.error('Failed to unban user');
		}
	}

	if (checkingAuth) {
		return (
			<PageLayout title="User Management" description="Checking access...">
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
							<Shield className="w-10 h-10 text-red-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h2>
						<p className="text-gray-600 mb-6">
							You don't have permission to access this page.
						</p>
						<Button onClick={() => router.push('/dashboard')}>
							Go to Dashboard
						</Button>
					</CardContent>
				</Card>
			</PageLayout>
		);
	}

	return (
		<PageLayout 
			title="User Management" 
			description="Manage users, permissions, and access"
			action={
				<Button variant="outline" onClick={() => router.push('/admin')}>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Admin
				</Button>
			}
		>
			{/* Search */}
			<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl mb-6">
				<CardContent className="pt-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<Input
							placeholder="Search users by name, email, year, or batch..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Users List */}
			{loading ? (
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading users...</p>
				</div>
			) : filteredUsers.length === 0 ? (
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardContent className="p-12 text-center">
						<Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
						<p className="text-gray-500">No users found</p>
					</CardContent>
				</Card>
			) : (
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Users className="w-5 h-5 text-blue-600" />
								All Users ({filteredUsers.length})
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{filteredUsers.map((u: any) => (
								<div key={u.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
									<Avatar>
										<AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
											{u.name?.substring(0, 2).toUpperCase() || 'U'}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<div className="font-semibold text-gray-800 truncate">{u.name || 'Unknown'}</div>
											{u.isAdmin && (
												<Badge className="bg-purple-100 text-purple-700 border-purple-200">
													<Shield className="w-3 h-3 mr-1" />
													Admin
												</Badge>
											)}
											{u.banned && (
												<Badge className="bg-red-100 text-red-700 border-red-200">
													<Ban className="w-3 h-3 mr-1" />
													Banned
												</Badge>
											)}
										</div>
										<div className="text-sm text-gray-500 truncate">{u.email}</div>
										<div className="flex items-center gap-2 mt-1">
											{u.year && <span className="text-xs text-gray-500">{u.year} Year</span>}
											{u.batch && <span className="text-xs text-gray-500">• {u.batch}</span>}
											{u.course && <span className="text-xs text-gray-500">• {u.course}</span>}
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => toggleAdmin(u.id, u.isAdmin)}
											className={u.isAdmin ? 'border-purple-200 text-purple-700' : ''}
										>
											<Shield className="w-4 h-4 mr-1" />
											{u.isAdmin ? 'Remove Admin' : 'Make Admin'}
										</Button>
										{u.banned ? (
											<Button
												variant="outline"
												size="sm"
												onClick={() => unbanUser(u.id, u.name || 'User')}
												className="border-green-200 text-green-700 hover:bg-green-50"
											>
												<Check className="w-4 h-4 mr-1" />
												Unban
											</Button>
										) : (
											<Button
												variant="outline"
												size="sm"
												onClick={() => banUser(u.id, u.name || 'User')}
												className="border-red-200 text-red-700 hover:bg-red-50"
											>
												<Ban className="w-4 h-4 mr-1" />
												Ban
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</PageLayout>
	);
}

