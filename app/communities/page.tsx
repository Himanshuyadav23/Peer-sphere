"use client";

import Link from 'next/link';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { getDb } from '@/lib/firebase';
import type { Community } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Calendar, Plus } from 'lucide-react';

const categories = [
	'Academic',
	'Technology',
	'Sports',
	'Arts & Culture',
	'Gaming',
	'Programming',
	'Design',
	'Music',
	'Photography',
	'Debate',
	'Literature',
	'Other'
];

export default function CommunitiesListPage() {
	const [communities, setCommunities] = useState<Community[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');

	useEffect(() => {
		const q = query(
			collection(getDb(), 'communities'),
			orderBy('createdAt', 'desc')
		);
		const unsub = onSnapshot(q, (snap) => {
			const allCommunities = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Community));
			// Filter out deleted communities on the client side
			const activeCommunities = allCommunities.filter(community => !community.deleted);
			setCommunities(activeCommunities);
		}, (error) => {
			console.error('Error fetching communities:', error);
		});
		return () => unsub();
	}, []);

	const filteredCommunities = useMemo(() => {
		return communities.filter((community) => {
			const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				community.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = !selectedCategory || community.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	}, [communities, searchQuery, selectedCategory]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
			<div className="relative">
				{/* Animated background */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
					<div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
				</div>

				<div className="relative space-y-8 p-6">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
								Communities
							</h1>
							<p className="text-gray-600 mt-2">Discover and join amazing communities</p>
						</div>
						<Link href="/communities/create">
							<Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 gap-2">
								<Plus className="h-4 w-4" />
								Create Community
							</Button>
						</Link>
					</div>

					{/* Search and Filter */}
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="flex-1">
							<Input
								placeholder="Search communities..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full bg-white/80 backdrop-blur-sm border-white/20 shadow-lg focus:shadow-xl transition-all duration-300"
							/>
						</div>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="flex h-10 w-full rounded-md border border-white/20 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm shadow-lg focus:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 transition-all duration-300 sm:w-auto"
						>
							<option value="">All Categories</option>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>

					{/* Results Count */}
					<div className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
						{filteredCommunities.length} {filteredCommunities.length === 1 ? 'community' : 'communities'} found
					</div>

					{/* Communities Grid */}
					{filteredCommunities.length === 0 ? (
						<div className="rounded-3xl border-2 border-dashed border-white/40 bg-white/60 backdrop-blur-sm p-12 text-center shadow-xl">
							<div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
								<Users className="h-8 w-8 text-pink-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-3">No communities found</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">
								{searchQuery || selectedCategory 
									? 'Try adjusting your search or filters.' 
									: 'Be the first to create a community for SCSIT students!'
								}
							</p>
							{!searchQuery && !selectedCategory && (
								<Link href="/communities/create">
									<Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
										<Plus className="h-4 w-4 mr-2" />
										Create Community
									</Button>
								</Link>
							)}
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{filteredCommunities.map((community) => (
								<Card key={community.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
									<CardHeader className="pb-4">
										<div className="flex items-start justify-between">
											<div className="space-y-2">
												<CardTitle className="line-clamp-1 text-lg font-bold text-gray-800">{community.name}</CardTitle>
												<Badge className="w-fit bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200">
													{community.category}
												</Badge>
											</div>
											<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
												<span className="text-white font-bold text-sm">
													{community.name.substring(0, 2).toUpperCase()}
												</span>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-6">
										<p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
											{community.description}
										</p>
										
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4 text-sm text-gray-500">
												<div className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													{community.members?.length || 0}
												</div>
												{community.createdAt && (
													<div className="flex items-center gap-1">
														<Calendar className="h-4 w-4" />
														{new Date(community.createdAt.seconds * 1000).toLocaleDateString()}
													</div>
												)}
											</div>
										</div>

										<Link href={`/communities/${community.id}`}>
											<Button size="sm" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
												View Community
											</Button>
										</Link>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

