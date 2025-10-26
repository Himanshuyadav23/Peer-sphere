"use client";

import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';
import { getTopMatches, getSmartMatches } from '@/lib/matchmaking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Star, Users, Calendar, MapPin, Sparkles, Zap } from 'lucide-react';

export default function MatchesPage() {
	const auth = getFirebaseAuth();
	const router = useRouter();
	const me = auth.currentUser?.uid || '';
	const [matches, setMatches] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<'smart' | 'interests'>('smart');

	useEffect(() => {
		if (!me) return;
		
		const loadMatches = async () => {
			setLoading(true);
			try {
				if (activeTab === 'smart') {
					const smartMatches = await getSmartMatches(me);
					setMatches(smartMatches);
				} else {
					const interestMatches = await getTopMatches(me, 20);
					setMatches(interestMatches);
				}
			} catch (error) {
				console.error('Error loading matches:', error);
			} finally {
				setLoading(false);
			}
		};

		loadMatches();
	}, [me, activeTab]);

	const getMatchPercentage = (score: number, maxScore: number = 5) => {
		return Math.round((score / maxScore) * 100);
	};

	const getMatchLevel = (percentage: number) => {
		if (percentage >= 80) return { label: 'Perfect Match', color: 'text-green-600', bg: 'bg-green-100' };
		if (percentage >= 60) return { label: 'Great Match', color: 'text-blue-600', bg: 'bg-blue-100' };
		if (percentage >= 40) return { label: 'Good Match', color: 'text-yellow-600', bg: 'bg-yellow-100' };
		return { label: 'Potential Match', color: 'text-gray-600', bg: 'bg-gray-100' };
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<Sparkles className="w-8 h-8 text-white animate-pulse" />
					</div>
					<p className="text-gray-600">Finding your perfect matches...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
			<div className="relative">
				{/* Animated background */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
					<div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
				</div>

				<div className="relative space-y-8 p-6">
					{/* Header */}
					<div className="text-center">
						<h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
							Smart Matches
						</h1>
						<p className="text-lg text-gray-600">Discover amazing SCSIT students like you</p>
					</div>

					{/* Tab Navigation */}
					<div className="flex justify-center">
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
							<div className="flex gap-2">
								<button
									onClick={() => setActiveTab('smart')}
									className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
										activeTab === 'smart'
											? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
											: 'text-gray-600 hover:text-gray-900'
									}`}
								>
									<Zap className="w-4 h-4" />
									Smart Match
								</button>
								<button
									onClick={() => setActiveTab('interests')}
									className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
										activeTab === 'interests'
											? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
											: 'text-gray-600 hover:text-gray-900'
									}`}
								>
									<Heart className="w-4 h-4" />
									By Interests
								</button>
							</div>
						</div>
					</div>

					{/* Matches Grid */}
					{matches.length === 0 ? (
						<div className="text-center py-16">
							<div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<Heart className="w-12 h-12 text-pink-600" />
							</div>
							<h3 className="text-2xl font-bold text-gray-800 mb-3">No matches found</h3>
							<p className="text-gray-600 max-w-md mx-auto">
								{activeTab === 'smart' 
									? 'Complete your profile to get better matches!'
									: 'Add more interests to your profile to find like-minded students.'
								}
							</p>
							<Button 
								className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
								onClick={() => router.push('/profile/setup')}
							>
								Complete Profile
							</Button>
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{matches.map((match) => {
								const percentage = getMatchPercentage(match.score);
								const matchLevel = getMatchLevel(percentage);
								
								return (
									<Card key={match.uid} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
										<CardHeader className="pb-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Avatar className="w-14 h-14 border-4 border-white shadow-lg">
														<AvatarFallback className="text-lg font-bold bg-gradient-to-br from-pink-500 to-purple-600 text-white">
															{match.name.substring(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div>
														<CardTitle className="text-lg font-bold text-gray-800">{match.name}</CardTitle>
														<div className="flex items-center gap-2">
															<Badge className={`${matchLevel.bg} ${matchLevel.color} border-0`}>
																{matchLevel.label}
															</Badge>
															<span className="text-sm text-gray-500">{percentage}% match</span>
														</div>
													</div>
												</div>
											</div>
										</CardHeader>
										
										<CardContent className="space-y-6">
											{/* Profile Info */}
											<div className="space-y-3">
												<div className="flex items-center gap-2 text-sm text-gray-600">
													<Users className="w-4 h-4" />
													{match.year} Year • {match.batch}
												</div>
												{match.interests && match.interests.length > 0 && (
													<div className="space-y-2">
														<div className="text-sm font-medium text-gray-700">Shared Interests:</div>
														<div className="flex flex-wrap gap-2">
															{match.interests.slice(0, 4).map((interest: string, index: number) => (
																<Badge key={index} variant="secondary" className="text-xs bg-pink-100 text-pink-700 border-pink-200">
																	{interest}
																</Badge>
															))}
															{match.interests.length > 4 && (
																<Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
																	+{match.interests.length - 4} more
																</Badge>
															)}
														</div>
													</div>
												)}
											</div>

											{/* Action Buttons */}
											<div className="flex gap-3">
												<Button 
													size="sm" 
													className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
													onClick={() => router.push(`/messages/${match.uid}`)}
												>
													<MessageCircle className="w-4 h-4 mr-2" />
													Connect
												</Button>
												<Button 
													size="sm" 
													variant="outline"
													className="border-2 border-gray-300 hover:border-pink-500 hover:text-pink-600 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300"
													onClick={() => router.push(`/profile/${match.uid}`)}
												>
													<Star className="w-4 h-4" />
												</Button>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					)}

					{/* Stats */}
					{matches.length > 0 && (
						<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
							<CardContent className="p-6">
								<div className="text-center">
									<h3 className="text-lg font-bold text-gray-800 mb-2">Your Match Stats</h3>
									<div className="flex justify-center gap-8">
										<div className="text-center">
											<div className="text-2xl font-bold text-pink-600">{matches.length}</div>
											<div className="text-sm text-gray-600">Total Matches</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-purple-600">
												{matches.filter(m => getMatchPercentage(m.score) >= 80).length}
											</div>
											<div className="text-sm text-gray-600">Perfect Matches</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-indigo-600">
												{Math.round(matches.reduce((acc, m) => acc + getMatchPercentage(m.score), 0) / matches.length)}%
											</div>
											<div className="text-sm text-gray-600">Avg Compatibility</div>
										</div>
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

