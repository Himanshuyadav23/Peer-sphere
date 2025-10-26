"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFirebaseAuth } from '@/lib/firebase';
import { createCommunity } from '@/lib/communities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const communitySchema = z.object({
	name: z.string().min(3, 'Community name must be at least 3 characters').max(50, 'Community name must be less than 50 characters'),
	description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
	category: z.string().min(1, 'Please select a category'),
});

type CommunityFormData = z.infer<typeof communitySchema>;

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

export default function CreateCommunityPage() {
	const router = useRouter();
	const auth = getFirebaseAuth();
	const [loading, setLoading] = useState(false);
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CommunityFormData>({
		resolver: zodResolver(communitySchema),
	});

	async function onSubmit(data: CommunityFormData) {
		if (!auth.currentUser) {
			toast.error('You must be logged in to create a community');
			return;
		}

		setLoading(true);
		try {
			const communityId = await createCommunity({
				name: data.name,
				description: data.description,
				category: data.category,
				createdBy: auth.currentUser.uid,
			});
			
			toast.success('Community created successfully!');
			router.push(`/communities/${communityId}`);
		} catch (error: any) {
			toast.error(error.message || 'Failed to create community');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
			<div className="container mx-auto max-w-2xl py-12 px-6">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
						Create a Community
					</h1>
					<p className="text-lg text-gray-600">
						Start a new community for SCSIT students to connect and collaborate.
					</p>
				</div>
				<Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-2xl">
					<CardHeader className="text-center pb-8">
						<div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
							<Plus className="w-8 h-8 text-white" />
						</div>
						<CardTitle className="text-2xl">Build Something Amazing</CardTitle>
						<CardDescription className="text-base">
							Create a space where SCSIT students can come together and grow.
						</CardDescription>
					</CardHeader>
					<CardContent className="px-8 pb-8">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
							<div className="space-y-3">
								<Label htmlFor="name" className="text-base font-semibold text-gray-700">Community Name</Label>
								<Input
									id="name"
									placeholder="e.g., Web Development Club"
									className="h-12 bg-white/80 border-gray-200 focus:border-pink-500 focus:ring-pink-500 shadow-lg"
									{...register('name')}
								/>
								{errors.name && (
									<p className="text-sm text-red-500 flex items-center gap-1">
										<span className="w-1 h-1 bg-red-500 rounded-full"></span>
										{errors.name.message}
									</p>
								)}
							</div>

							<div className="space-y-3">
								<Label htmlFor="category" className="text-base font-semibold text-gray-700">Category</Label>
								<select
									id="category"
									className="flex h-12 w-full rounded-md border border-gray-200 bg-white/80 px-4 py-3 text-sm shadow-lg focus:border-pink-500 focus:ring-pink-500 focus:outline-none transition-colors"
									{...register('category')}
								>
									<option value="">Select a category</option>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
								{errors.category && (
									<p className="text-sm text-red-500 flex items-center gap-1">
										<span className="w-1 h-1 bg-red-500 rounded-full"></span>
										{errors.category.message}
									</p>
								)}
							</div>

							<div className="space-y-3">
								<Label htmlFor="description" className="text-base font-semibold text-gray-700">Description</Label>
								<Textarea
									id="description"
									placeholder="Describe what your community is about, what activities you'll do, and who should join..."
									rows={5}
									className="bg-white/80 border-gray-200 focus:border-pink-500 focus:ring-pink-500 shadow-lg resize-none"
									{...register('description')}
								/>
								{errors.description && (
									<p className="text-sm text-red-500 flex items-center gap-1">
										<span className="w-1 h-1 bg-red-500 rounded-full"></span>
										{errors.description.message}
									</p>
								)}
							</div>

							<div className="flex flex-col sm:flex-row gap-4 pt-4">
								<Button 
									type="submit" 
									disabled={loading} 
									className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
								>
									{loading ? (
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
											Creating...
										</div>
									) : (
										<div className="flex items-center gap-2">
											<Plus className="w-4 h-4" />
											Create Community
										</div>
									)}
								</Button>
								<Button 
									type="button" 
									variant="outline" 
									onClick={() => router.back()}
									className="h-12 border-2 border-gray-300 hover:border-pink-500 hover:text-pink-600 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300"
								>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
