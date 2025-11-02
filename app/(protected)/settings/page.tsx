"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getDb } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/page-layout';
import { Settings, User, Bell, Shield, LogOut, Mail, Calendar, Users, Award } from 'lucide-react';
import { toast } from 'sonner';
import { signOut } from 'firebase/auth';

export default function SettingsPage() {
	const router = useRouter();
	const auth = getFirebaseAuth();
	const user = auth.currentUser;
	const [userData, setUserData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			router.push('/login');
			return;
		}

		loadUserData();
	}, [user]);

	async function loadUserData() {
		if (!user) return;

		try {
			const db = getDb();
			const userDoc = await getDoc(doc(db, 'users', user.uid));
			
			if (userDoc.exists()) {
				setUserData(userDoc.data());
			}
		} catch (error) {
			console.error('Error loading user data:', error);
		} finally {
			setLoading(false);
		}
	}

	async function handleSignOut() {
		if (!confirm('Are you sure you want to sign out?')) return;

		try {
			await signOut(auth);
			toast.success('Signed out successfully');
			router.push('/login');
		} catch (error) {
			console.error('Error signing out:', error);
			toast.error('Failed to sign out');
		}
	}

	if (loading) {
		return (
			<PageLayout title="Settings" description="Manage your account">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading settings...</p>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout title="Settings" description="Manage your account and preferences">
			<div className="space-y-6">
				{/* Profile Info */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="w-5 h-5 text-blue-600" />
							Profile Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-4 mb-6">
							<Avatar className="w-20 h-20">
								<AvatarImage src={userData?.avatarUrl} />
								<AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-2xl">
									{userData?.name?.substring(0, 2).toUpperCase() || 'U'}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="text-xl font-bold text-gray-800">{userData?.name || 'User'}</div>
								<div className="text-sm text-gray-500">{user?.email}</div>
								<div className="flex items-center gap-2 mt-2">
									{userData?.year && <Badge variant="secondary">{userData.year}</Badge>}
									{userData?.batch && <Badge variant="secondary">{userData.batch}</Badge>}
									{userData?.isAdmin && (
										<Badge className="bg-purple-100 text-purple-700 border-purple-200">
											<Shield className="w-3 h-3 mr-1" />
											Admin
										</Badge>
									)}
								</div>
							</div>
						</div>
						<Button 
							variant="outline" 
							onClick={() => router.push('/profile/edit')}
							className="w-full"
						>
							<Settings className="w-4 h-4 mr-2" />
							Edit Profile
						</Button>
					</CardContent>
				</Card>

				{/* Account Settings */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Settings className="w-5 h-5 text-indigo-600" />
							Account Settings
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button 
							variant="ghost" 
							className="w-full justify-start"
							onClick={() => router.push('/profile/edit')}
						>
							<User className="w-5 h-5 mr-3 text-gray-600" />
							Edit Profile Information
						</Button>
						<Button 
							variant="ghost" 
							className="w-full justify-start"
							onClick={() => router.push('/communities/my')}
						>
							<Users className="w-5 h-5 mr-3 text-gray-600" />
							My Communities
						</Button>
						<Button 
							variant="ghost" 
							className="w-full justify-start"
							onClick={() => router.push('/events')}
						>
							<Calendar className="w-5 h-5 mr-3 text-gray-600" />
							My Events
						</Button>
						{userData?.isAdmin && (
							<Button 
								variant="ghost" 
								className="w-full justify-start"
								onClick={() => router.push('/admin')}
							>
								<Shield className="w-5 h-5 mr-3 text-gray-600" />
								Admin Panel
							</Button>
						)}
					</CardContent>
				</Card>

				{/* Notifications */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bell className="w-5 h-5 text-orange-600" />
							Notifications
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">Email Notifications</div>
								<div className="text-sm text-gray-500">Receive updates via email</div>
							</div>
							<Badge variant="secondary">Coming Soon</Badge>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">Push Notifications</div>
								<div className="text-sm text-gray-500">Get notified on your device</div>
							</div>
							<Badge variant="secondary">Coming Soon</Badge>
						</div>
					</CardContent>
				</Card>

				{/* Support */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Mail className="w-5 h-5 text-green-600" />
							Support
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button variant="ghost" className="w-full justify-start">
							<Mail className="w-5 h-5 mr-3 text-gray-600" />
							Contact Support
						</Button>
						<Button variant="ghost" className="w-full justify-start" onClick={() => toast.info('Help center coming soon!')}>
							<Award className="w-5 h-5 mr-3 text-gray-600" />
							Help Center
						</Button>
					</CardContent>
				</Card>

				{/* Danger Zone */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl border-red-200">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-red-600">
							<LogOut className="w-5 h-5" />
							Danger Zone
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Button 
							variant="outline" 
							className="w-full border-red-300 text-red-700 hover:bg-red-50"
							onClick={handleSignOut}
						>
							<LogOut className="w-4 h-4 mr-2" />
							Sign Out
						</Button>
					</CardContent>
				</Card>
			</div>
		</PageLayout>
	);
}

