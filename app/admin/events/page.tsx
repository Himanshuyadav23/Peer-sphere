"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { deleteEvent } from '@/lib/events';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import PageLayout from '@/components/page-layout';
import { Calendar, Shield, Trash2, ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminEventsPage() {
	const auth = getFirebaseAuth();
	const router = useRouter();
	const user = auth.currentUser;
	const [isAdmin, setIsAdmin] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true);
	const [events, setEvents] = useState<any[]>([]);
	const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAdminAccess();
	}, []);

	useEffect(() => {
		// Filter events based on search query
		if (!searchQuery.trim()) {
			setFilteredEvents(events);
		} else {
			const query = searchQuery.toLowerCase();
			setFilteredEvents(
				events.filter(e => 
					e.title?.toLowerCase().includes(query) || 
					e.description?.toLowerCase().includes(query) ||
					e.venue?.toLowerCase().includes(query)
				)
			);
		}
	}, [searchQuery, events]);

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
					loadEvents();
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

	async function loadEvents() {
		try {
			setLoading(true);
			const db = getDb();
			const eventsSnap = await getDocs(collection(db, 'events'));
			
			const eventsList = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
			// Filter out deleted events and sort by created date
			const activeEvents = eventsList
				.filter((e: any) => !e.deleted)
				.sort((a: any, b: any) => {
					const aTime = a.createdAt?.seconds || 0;
					const bTime = b.createdAt?.seconds || 0;
					return bTime - aTime;
				});

			setEvents(activeEvents);
			setFilteredEvents(activeEvents);
		} catch (error) {
			console.error('Error loading events:', error);
			toast.error('Failed to load events');
		} finally {
			setLoading(false);
			setCheckingAuth(false);
		}
	}

	async function handleDeleteEvent(eventId: string, eventTitle: string) {
		if (!confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone and will remove the event from the platform.`)) {
			return;
		}

		try {
			await deleteEvent(eventId);
			toast.success(`Event "${eventTitle}" has been deleted`);
			loadEvents();
		} catch (error) {
			console.error('Error deleting event:', error);
			toast.error('Failed to delete event');
		}
	}

	if (checkingAuth) {
		return (
			<PageLayout title="Event Management" description="Checking access...">
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

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	};

	return (
		<PageLayout 
			title="Event Management" 
			description="Manage events and content"
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
							placeholder="Search events by title, description, or venue..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Events List */}
			{loading ? (
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading events...</p>
				</div>
			) : filteredEvents.length === 0 ? (
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardContent className="p-12 text-center">
						<Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
						<p className="text-gray-500">No events found</p>
					</CardContent>
				</Card>
			) : (
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Calendar className="w-5 h-5 text-orange-600" />
								All Events ({filteredEvents.length})
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{filteredEvents.map((e: any) => (
								<div key={e.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
									<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
										<Calendar className="w-6 h-6 text-white" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<div className="font-semibold text-gray-800 truncate">{e.title}</div>
										</div>
										<div className="text-sm text-gray-500 truncate mt-1">{e.description || 'No description'}</div>
										<div className="flex items-center gap-2 mt-2 flex-wrap">
											<span className="text-xs text-gray-500">
												{formatDate(e.date)} at {e.time}
											</span>
											{e.venue && (
												<span className="text-xs text-gray-500">
													• {e.venue}
												</span>
											)}
											<span className="text-xs text-gray-500">
												• {e.attendees?.length || 0} attendees
											</span>
										</div>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDeleteEvent(e.id, e.title)}
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


