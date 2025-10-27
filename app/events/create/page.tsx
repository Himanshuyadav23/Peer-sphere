"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';
import { createEvent } from '@/lib/events';
import { getMyCommunities } from '@/lib/communities';
import type { Community } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PageLayout from '@/components/page-layout';
import { toast } from 'sonner';
import { Calendar, MapPin, Clock, FileText, Users, Loader2 } from 'lucide-react';

export default function CreateEventPage() {
	const router = useRouter();
	const auth = getFirebaseAuth();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [venue, setVenue] = useState('');
	const [communityId, setCommunityId] = useState('');
	const [myCommunities, setMyCommunities] = useState<Community[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const uid = auth.currentUser?.uid;

	useEffect(() => {
		if (!uid) return;
		getMyCommunities(uid).then(communities => {
			setMyCommunities(communities);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, [uid]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const user = auth.currentUser;
		if (!user) return toast.error('Not authenticated');
		if (!communityId) return toast.error('Please select a community');
		setSaving(true);
		try {
			const id = await createEvent({ title, description, date, time, venue, createdBy: user.uid, communityId });
			toast.success('Event created successfully!');
			router.push(`/events/${id}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to create event');
		} finally {
			setSaving(false);
		}
	}

	return (
		<PageLayout 
			title="Create New Event" 
			description="Organize and host events for your community"
			showBack={true}
			backHref="/events"
		>
			<div className="max-w-2xl mx-auto">
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-2xl">
							<Calendar className="w-6 h-6 text-pink-600" />
							Event Details
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={onSubmit} className="space-y-6">
							{/* Title */}
							<div className="space-y-2">
								<Label htmlFor="title" className="flex items-center gap-2">
									<FileText className="w-4 h-4 text-pink-600" />
									Event Title *
								</Label>
								<Input 
									id="title" 
									value={title} 
									onChange={(e) => setTitle(e.target.value)} 
									required
									placeholder="Enter event name"
									className="h-11"
								/>
							</div>

							{/* Description */}
							<div className="space-y-2">
								<Label htmlFor="description" className="flex items-center gap-2">
									<FileText className="w-4 h-4 text-purple-600" />
									Description
								</Label>
								<Textarea 
									id="description" 
									value={description} 
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Describe your event..."
									rows={4}
									className="resize-none"
								/>
							</div>

							{/* Date and Time */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="date" className="flex items-center gap-2">
										<Calendar className="w-4 h-4 text-blue-600" />
										Date *
									</Label>
									<Input 
										id="date" 
										type="date" 
										value={date} 
										onChange={(e) => setDate(e.target.value)} 
										required
										className="h-11"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="time" className="flex items-center gap-2">
										<Clock className="w-4 h-4 text-green-600" />
										Time *
									</Label>
									<Input 
										id="time" 
										type="time" 
										value={time} 
										onChange={(e) => setTime(e.target.value)} 
										required
										className="h-11"
									/>
								</div>
							</div>

							{/* Venue */}
							<div className="space-y-2">
								<Label htmlFor="venue" className="flex items-center gap-2">
									<MapPin className="w-4 h-4 text-orange-600" />
									Venue *
								</Label>
								<Input 
									id="venue" 
									value={venue} 
									onChange={(e) => setVenue(e.target.value)} 
									required
									placeholder="Enter venue address"
									className="h-11"
								/>
							</div>

							{/* Community */}
							<div className="space-y-2">
								<Label htmlFor="communityId" className="flex items-center gap-2">
									<Users className="w-4 h-4 text-pink-600" />
									Community *
								</Label>
								{loading ? (
									<Input disabled value="Loading communities..." className="h-11" />
								) : myCommunities.length === 0 ? (
									<>
										<Input 
											disabled
											value="No communities available. Join a community first!" 
											className="h-11"
										/>
										<p className="text-xs text-red-500">
											You need to join a community before creating events
										</p>
									</>
								) : (
									<>
										<select 
											id="communityId"
											value={communityId} 
											onChange={(e) => setCommunityId(e.target.value)} 
											required
											className="w-full h-11 rounded-md border border-input bg-background px-3 py-2"
										>
											<option value="">Select Community</option>
											{myCommunities.map(community => (
												<option key={community.id} value={community.id}>
													{community.name}
												</option>
											))}
										</select>
										<p className="text-xs text-gray-500">
											Select the community hosting this event
										</p>
									</>
								)}
							</div>

							{/* Submit Button */}
							<div className="pt-4 flex gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}
									className="flex-1"
									disabled={saving}
								>
									Cancel
								</Button>
								<Button 
									type="submit" 
									disabled={saving || myCommunities.length === 0}
									className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
								>
									{saving ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Creating...
										</>
									) : (
										<>
											<Calendar className="w-4 h-4 mr-2" />
											Create Event
										</>
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</PageLayout>
	);
}
