"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import type { Community, UserDoc } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { joinCommunity, leaveCommunity, deleteCommunity } from '@/lib/communities';
import { toast } from 'sonner';
import { Users, Calendar, Settings, Trash2, Edit, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CommunityDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const id = params?.id as string;
	const auth = getFirebaseAuth();
	const [community, setCommunity] = useState<Community | null>(null);
	const [members, setMembers] = useState<UserDoc[]>([]);
	const [loading, setLoading] = useState(false);
	const uid = auth.currentUser?.uid;
	
	const isMember = useMemo(() => !!(community?.members || []).includes(uid || ''), [community, uid]);
	const isCreator = useMemo(() => community?.createdBy === uid, [community, uid]);

	useEffect(() => {
		if (!id) return;
		const unsub = onSnapshot(doc(getDb(), 'communities', id), (snap) => {
			if (!snap.exists()) return setCommunity(null);
			setCommunity({ id: snap.id, ...(snap.data() as any) } as Community);
		});
		return () => unsub();
	}, [id]);

	useEffect(() => {
		if (!community?.members?.length) {
			setMembers([]);
			return;
		}

		const q = query(
			collection(getDb(), 'users'),
			where('uid', 'in', community.members.slice(0, 10)) // Firestore 'in' limit is 10
		);
		
		const unsub = onSnapshot(q, (snap) => {
			setMembers(snap.docs.map((d) => d.data() as UserDoc));
		});
		return () => unsub();
	}, [community?.members]);

	async function onToggle() {
		if (!uid || !id) return;
		setLoading(true);
		try {
			if (isMember) await leaveCommunity(id, uid);
			else await joinCommunity(id, uid);
		} catch (e: any) {
			toast.error(e.message || 'Failed');
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
			return;
		}
		
		setLoading(true);
		try {
			await deleteCommunity(id);
			toast.success('Community deleted successfully');
			router.push('/communities');
		} catch (e: any) {
			toast.error(e.message || 'Failed to delete community');
		} finally {
			setLoading(false);
		}
	}

	if (!community) return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-muted-foreground">Loading community...</p>
			</div>
		</div>
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-3">
						<Avatar className="h-16 w-16">
							<AvatarFallback className="text-lg">
								{community.name.substring(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="text-3xl font-bold">{community.name}</h1>
							<Badge variant="secondary">{community.category}</Badge>
						</div>
					</div>
					<p className="text-lg text-muted-foreground max-w-2xl">{community.description}</p>
				</div>
				
				<div className="flex flex-col gap-2 sm:flex-row">
					{isCreator && (
						<>
							<Link href={`/communities/${id}/settings`}>
								<Button variant="outline" size="sm" className="gap-2">
									<Edit className="h-4 w-4" />
									Edit
								</Button>
							</Link>
							<Button 
								variant="destructive" 
								size="sm" 
								onClick={handleDelete}
								disabled={loading}
								className="gap-2"
							>
								<Trash2 className="h-4 w-4" />
								Delete
							</Button>
						</>
					)}
					<Button 
						onClick={onToggle} 
						disabled={loading}
						variant={isMember ? "outline" : "default"}
						className="gap-2"
					>
						{isMember ? (
							<>
								<Users className="h-4 w-4" />
								Leave Community
							</>
						) : (
							<>
								<Plus className="h-4 w-4" />
								Join Community
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Users className="h-5 w-5 text-primary" />
							<div>
								<p className="text-2xl font-bold">{community.members?.length || 0}</p>
								<p className="text-sm text-muted-foreground">Members</p>
							</div>
						</div>
					</CardContent>
				</Card>
				
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Calendar className="h-5 w-5 text-primary" />
							<div>
								<p className="text-2xl font-bold">
									{community.createdAt ? new Date(community.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
								</p>
								<p className="text-sm text-muted-foreground">Created</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Settings className="h-5 w-5 text-primary" />
							<div>
								<p className="text-2xl font-bold">{isCreator ? 'Admin' : 'Member'}</p>
								<p className="text-sm text-muted-foreground">Your Role</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Members Section */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Members ({community.members?.length || 0})
						</CardTitle>
						{isMember && (
							<Link href={`/communities/${id}/events`}>
								<Button size="sm" variant="outline" className="gap-2">
									<Calendar className="h-4 w-4" />
									View Events
								</Button>
							</Link>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{members.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No members found</p>
						</div>
					) : (
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{members.map((member) => (
								<div key={member.uid} className="flex items-center gap-3 p-3 rounded-lg border">
									<Avatar>
										<AvatarFallback>
											{member.name.substring(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<p className="font-medium truncate">{member.name}</p>
										<p className="text-sm text-muted-foreground truncate">{member.year} • {member.batch}</p>
									</div>
									{member.uid === community.createdBy && (
										<Badge variant="secondary" className="text-xs">Creator</Badge>
									)}
								</div>
							))}
							{community.members && community.members.length > 10 && (
								<div className="flex items-center justify-center p-3 rounded-lg border border-dashed">
									<p className="text-sm text-muted-foreground">
										+{community.members.length - 10} more members
									</p>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
