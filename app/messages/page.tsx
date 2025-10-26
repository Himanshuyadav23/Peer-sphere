"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getFirebaseAuth, getDb } from '@/lib/firebase';
import { listenToRecentConversations } from '@/lib/messages';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { MessageCircle, Search, Plus, Users, Heart, Send } from 'lucide-react';

export default function MessagesPage() {
	const auth = getFirebaseAuth();
	const me = auth.currentUser?.uid || '';
	const [rows, setRows] = useState<any[]>([]);
	const [userMap, setUserMap] = useState<Record<string, any>>({});
	const [searchQuery, setSearchQuery] = useState('');
	const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (!me) return;
		const unsub = listenToRecentConversations(me, setRows);
		return () => unsub();
	}, [me]);

	useEffect(() => {
		(async () => {
			const db = getDb();
			const missing = rows.map((r) => r.otherUserId).filter((id) => !userMap[id]);
			if (missing.length === 0) return;
			const entries = await Promise.all(missing.map(async (id) => {
				const snap = await getDoc(doc(db, 'users', id));
				return [id, snap.exists() ? snap.data() : null] as const;
			}));
			setUserMap((m) => ({ ...m, ...Object.fromEntries(entries) }));
		})();
	}, [rows]);

	// Listen for online users (simplified - in real app you'd use presence)
	useEffect(() => {
		if (!me) return;
		// For now, just set the current user as online
		// In a real app, you'd implement proper presence detection
		setOnlineUsers(new Set([me]));
	}, [me]);

	const filteredRows = useMemo(() => {
		if (!searchQuery) return rows;
		return rows.filter(r => {
			const u = userMap[r.otherUserId];
			const name = u?.name || '';
			return name.toLowerCase().includes(searchQuery.toLowerCase());
		});
	}, [rows, userMap, searchQuery]);

	const formatTime = (timestamp: any) => {
		if (!timestamp) return '';
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'now';
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays < 7) return `${diffDays}d`;
		return date.toLocaleDateString();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
			<div className="relative">
				{/* Animated background */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
					<div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
				</div>

				<div className="relative space-y-6 p-6">
					{/* Header */}
					<div className="text-center">
						<h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
							Messages
						</h1>
						<p className="text-lg text-gray-600">Stay connected with your SCSIT peers</p>
					</div>

					{/* Search Bar */}
					<div className="max-w-md mx-auto">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								placeholder="Search conversations..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg focus:shadow-xl transition-all duration-300"
							/>
						</div>
					</div>

					{/* Conversations */}
					{filteredRows.length === 0 ? (
						<div className="text-center py-16">
							<div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<MessageCircle className="w-12 h-12 text-pink-600" />
							</div>
							<h3 className="text-2xl font-bold text-gray-800 mb-3">
								{searchQuery ? 'No conversations found' : 'No conversations yet'}
							</h3>
							<p className="text-gray-600 max-w-md mx-auto mb-6">
								{searchQuery 
									? 'Try adjusting your search terms.'
									: 'Start a conversation by connecting with someone from your matches or communities!'
								}
							</p>
							{!searchQuery && (
								<div className="flex gap-3 justify-center">
									<Button 
										className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
										onClick={() => window.location.href = '/matches'}
									>
										<Heart className="w-4 h-4 mr-2" />
										Find Matches
									</Button>
									<Button 
										variant="outline"
										className="border-2 border-gray-300 hover:border-pink-500 hover:text-pink-600 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300"
										onClick={() => window.location.href = '/communities'}
									>
										<Users className="w-4 h-4 mr-2" />
										Join Communities
									</Button>
								</div>
							)}
						</div>
					) : (
						<div className="max-w-2xl mx-auto space-y-3">
							{filteredRows.map((r) => {
								const u = userMap[r.otherUserId];
								const name = u?.name || 'Unknown User';
								const avatar = u?.avatarUrl || '';
								const initials = name.slice(0, 2).toUpperCase();
								const isOnline = onlineUsers.has(r.otherUserId);
								const isUnread = r.senderId !== me; // Simple unread logic
								
								return (
									<Link key={r.otherUserId} href={`/messages/${r.otherUserId}`}>
										<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
											<CardContent className="p-4">
												<div className="flex items-center gap-4">
													<div className="relative">
														<Avatar className="w-12 h-12 border-2 border-white shadow-lg">
															<AvatarImage src={avatar} />
															<AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold">
																{initials}
															</AvatarFallback>
														</Avatar>
														{isOnline && (
															<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
														)}
													</div>
													
													<div className="min-w-0 flex-1">
														<div className="flex items-center justify-between mb-1">
															<h3 className="font-semibold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
																{name}
															</h3>
															<div className="flex items-center gap-2">
																{isUnread && (
																	<Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs">
																		New
																	</Badge>
																)}
																<span className="text-xs text-gray-500">
																	{formatTime(r.timestamp)}
																</span>
															</div>
														</div>
														<p className="text-sm text-gray-600 truncate group-hover:text-gray-800 transition-colors">
															{r.text}
														</p>
														{u?.year && u?.batch && (
															<div className="flex items-center gap-2 mt-1">
																<Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700 border-pink-200">
																	{u.year} Year
																</Badge>
																<Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
																	{u.batch}
																</Badge>
															</div>
														)}
													</div>

													<div className="opacity-0 group-hover:opacity-100 transition-opacity">
														<Button size="sm" variant="ghost" className="w-8 h-8 p-0">
															<Send className="w-4 h-4" />
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									</Link>
								);
							})}
						</div>
					)}

					{/* Quick Actions */}
					{filteredRows.length > 0 && (
						<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
							<CardContent className="p-6">
								<div className="text-center">
									<h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
									<div className="flex justify-center gap-4">
										<Button 
											variant="outline"
											className="border-2 border-gray-300 hover:border-pink-500 hover:text-pink-600 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300"
											onClick={() => window.location.href = '/matches'}
										>
											<Heart className="w-4 h-4 mr-2" />
											Find New Matches
										</Button>
										<Button 
											variant="outline"
											className="border-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300"
											onClick={() => window.location.href = '/communities'}
										>
											<Users className="w-4 h-4 mr-2" />
											Browse Communities
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}

