"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import type { UserDoc } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PageLayout from '@/components/page-layout';
import { User, Mail, GraduationCap, Calendar, MessageCircle, Edit, Heart, Users } from 'lucide-react';

export default function UserProfilePage() {
	const params = useParams<{ uid: string }>();
	const uid = params?.uid as string;
	const router = useRouter();
	const auth = getFirebaseAuth();
	const currentUserId = auth.currentUser?.uid;
	const isOwnProfile = uid === currentUserId;
	
	const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!uid) return;
		getDoc(doc(getDb(), 'users', uid)).then((snap) => {
			if (!snap.exists()) {
				setUserDoc(null);
			} else {
				setUserDoc(snap.data() as UserDoc);
			}
			setLoading(false);
		});
	}, [uid]);

	if (loading) {
		return (
			<PageLayout title="Profile" description="Loading...">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading profile...</p>
				</div>
			</PageLayout>
		);
	}

	if (!userDoc) {
		return (
			<PageLayout title="Profile Not Found" description="User doesn't exist">
				<div className="text-center py-12">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<User className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold mb-2">User not found</h3>
					<p className="text-sm text-muted-foreground mb-6">This profile doesn't exist or has been deleted.</p>
					<Button onClick={() => router.back()} variant="outline">
						Go Back
					</Button>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout 
			title={isOwnProfile ? "My Profile" : "Profile"}
			description={isOwnProfile ? "Manage your profile information" : `Viewing ${userDoc.name}'s profile`}
			showBack={true}
			action={
				<div className="flex gap-2">
					{isOwnProfile ? (
						<Button
							onClick={() => router.push(`/profile/edit`)}
							className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white gap-2"
						>
							<Edit className="h-4 w-4" />
							Edit Profile
						</Button>
					) : (
						<>
							<Button
								variant="outline"
								onClick={() => router.push('/messages')}
								className="gap-2"
							>
								<Users className="h-4 w-4" />
								Match
							</Button>
							<Button
								onClick={() => router.push(`/messages/${uid}`)}
								className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white gap-2"
							>
								<MessageCircle className="h-4 w-4" />
								Message
							</Button>
						</>
					)}
				</div>
			}
		>
			<div className="space-y-6">
				{/* Profile Header */}
				<Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl">
					<CardContent className="p-8">
						<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
							<Avatar className="w-32 h-32 border-4 border-white shadow-lg">
								<AvatarImage src={userDoc.avatarUrl} />
								<AvatarFallback className="bg-white/20 text-white text-4xl font-bold">
									{userDoc.name.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 text-center md:text-left">
								<h1 className="text-3xl font-black mb-2">{userDoc.name}</h1>
								<p className="text-pink-100 text-lg mb-4">{userDoc.email}</p>
								<div className="flex flex-wrap gap-2 justify-center md:justify-start">
									{userDoc.course && (
										<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
											<GraduationCap className="w-3 h-3 mr-1" />
											{userDoc.course}
										</Badge>
									)}
									{userDoc.year && (
										<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
											{userDoc.year} Year
										</Badge>
									)}
									{userDoc.batch && (
										<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
											<Calendar className="w-3 h-3 mr-1" />
											Batch {userDoc.batch}
										</Badge>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Interests */}
				{(userDoc.interests && userDoc.interests.length > 0) && (
					<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Heart className="w-5 h-5 text-pink-600" />
								Interests
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{userDoc.interests.map((interest, index) => (
									<Badge key={index} variant="secondary" className="bg-pink-100 text-pink-700 border-pink-200">
										{interest}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Additional Info */}
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle>Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
								<Mail className="w-6 h-6 text-white" />
							</div>
							<div>
								<div className="text-sm text-gray-500 mb-1">Email</div>
								<div className="font-semibold text-gray-800">{userDoc.email}</div>
							</div>
						</div>

						{userDoc.course && (
							<div className="flex items-center gap-4">
								<div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
									<GraduationCap className="w-6 h-6 text-white" />
								</div>
								<div>
									<div className="text-sm text-gray-500 mb-1">Course</div>
									<div className="font-semibold text-gray-800">{userDoc.course}</div>
								</div>
							</div>
						)}

						{userDoc.year && (
							<div className="flex items-center gap-4">
								<div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
									<GraduationCap className="w-6 h-6 text-white" />
								</div>
								<div>
									<div className="text-sm text-gray-500 mb-1">Year</div>
									<div className="font-semibold text-gray-800">{userDoc.year} Year</div>
								</div>
							</div>
						)}

						{userDoc.batch && (
							<div className="flex items-center gap-4">
								<div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
									<Calendar className="w-6 h-6 text-white" />
								</div>
								<div>
									<div className="text-sm text-gray-500 mb-1">Batch</div>
									<div className="font-semibold text-gray-800">{userDoc.batch}</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</PageLayout>
	);
}
