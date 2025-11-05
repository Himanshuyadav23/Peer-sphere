"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { deleteCommunity } from '@/lib/communities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import PageLayout from '@/components/page-layout';
import { Crown, Shield, Trash2, ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCommunitiesPage() {
	const auth = getFirebaseAuth();
	const router = useRouter();
	const user = auth.currentUser;
	const [isAdmin, setIsAdmin] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true);
	const [communities, setCommunities] = useState<any[]>([]);
	const [filteredCommunities, setFilteredCommunities] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAdminAccess();
	}, []);

	useEffect(() => {
		// Filter communities based on search query
		if (!searchQuery.trim()) {
			setFilteredCommunities(communities);
		} else {
			const query = searchQuery.toLowerCase();
			setFilteredCommunities(
				communities.filter(c => 
					c.name?.toLowerCase().includes(query) || 
					c.description?.toLowerCase().includes(query) ||
					c.category?.toLowerCase().includes(query)
				)
			);
		}
	}, [searchQuery, communities]);

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
					loadCommunities();
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

	async function loadCommunities() {
		try {
			setLoading(true);
			const db = getDb();
			const communitiesSnap = await getDocs(collection(db, 'communities'));
			
			const communitiesList = communitiesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
			// Filter out deleted communities and sort by created date
			const activeCommunities = communitiesList
				.filter((c: any) => !c.deleted)
				.sort((a: any, b: any) => {
					const aTime = a.createdAt?.seconds || 0;
					const bTime = b.createdAt?.seconds || 0;
					return bTime - aTime;
				});

			setCommunities(activeCommunities);
			setFilteredCommunities(activeCommunities);
		} catch (error) {
			console.error('Error loading communities:', error);
			toast.error('Failed to load communities');
		} finally {
			setLoading(false);
			setCheckingAuth(false);
		}
	}

	async function handleDeleteCommunity(communityId: string, communityName: string) {
		if (!confirm(`Are you sure you want to delete "${communityName}"? This action cannot be undone and will remove the community from the platform.`)) {
			return;
		}

		try {
			await deleteCommunity(communityId);
			toast.success(`Community "${communityName}" has been deleted`);
			loadCommunities();
		} catch (error) {
			console.error('Error deleting community:', error);
			toast.error('Failed to delete community');
		}
	}

	if (checkingAuth) {
		return (
			<PageLayout title="Community Management" description="Checking access...">
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
			title="Community Management" 
			description="Manage communities and content"
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
							placeholder="Search communities by name, description, or category..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Communities List */}
			{loading ? (
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading communities...</p>
				</div>
			) : filteredCommunities.length === 0 ? (
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardContent className="p-12 text-center">
						<Crown className="w-16 h-16 mx-auto mb-4 text-gray-300" />
						<p className="text-gray-500">No communities found</p>
					</CardContent>
				</Card>
			) : (
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Crown className="w-5 h-5 text-purple-600" />
								All Communities ({filteredCommunities.length})
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{filteredCommunities.map((c: any) => (
								<div key={c.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
									<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
										<span className="text-white font-bold text-sm">
											{c.name?.substring(0, 2).toUpperCase() || 'C'}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<div className="font-semibold text-gray-800 truncate">{c.name}</div>
										</div>
										<div className="text-sm text-gray-500 truncate mt-1">{c.description || 'No description'}</div>
										<div className="flex items-center gap-2 mt-2">
											<Badge variant="secondary" className="text-xs">
												{c.category || 'Uncategorized'}
											</Badge>
											<span className="text-xs text-gray-500">
												{c.members?.length || 0} members
											</span>
											{c.createdAt?.seconds && (
												<span className="text-xs text-gray-500">
													• {new Date(c.createdAt.seconds * 1000).toLocaleDateString()}
												</span>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDeleteCommunity(c.id, c.name)}
											className="border-red-200 text-red-700 hover:bg-red-50"
										>
											<Trash2 className="w-4 h-4 mr-1" />
											Delete
										</Button>
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


