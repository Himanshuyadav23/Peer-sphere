"use client";

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
	title: string;
	description?: string;
	children: ReactNode;
	showBack?: boolean;
	backHref?: string;
	action?: ReactNode;
}

export default function PageLayout({ 
	title, 
	description, 
	children, 
	showBack = false,
	backHref,
	action 
}: PageLayoutProps) {
	const router = useRouter();

	const handleBack = () => {
		if (backHref) {
			router.push(backHref);
		} else {
			router.back();
		}
	};

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-3">
						{showBack && (
							<Button 
								variant="ghost" 
								size="icon"
								onClick={handleBack}
								className="h-9 w-9"
							>
								<ArrowLeft className="h-5 w-5" />
							</Button>
						)}
						<div>
							<h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
								{title}
							</h1>
							{description && (
								<p className="text-gray-600 mt-1">{description}</p>
							)}
						</div>
					</div>
				</div>
				{action && (
					<div className="flex-shrink-0">
						{action}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="space-y-6">
				{children}
			</div>
		</div>
	);
}
