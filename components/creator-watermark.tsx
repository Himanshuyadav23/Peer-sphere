"use client";

import Link from 'next/link';
import { ExternalLink, Code, Heart } from 'lucide-react';

interface CreatorWatermarkProps {
	variant?: 'default' | 'compact' | 'minimal';
	className?: string;
}

export default function CreatorWatermark({ variant = 'default', className = '' }: CreatorWatermarkProps) {
	const creatorUrl = 'https://himanshuuyadav.netlify.app/';
	
	if (variant === 'minimal') {
		return (
			<div className={`text-center ${className}`}>
				<p className="text-xs text-gray-500">
					Made with <Heart className="inline w-3 h-3 text-red-500" /> by{' '}
					<Link 
						href={creatorUrl} 
						target="_blank" 
						rel="noopener noreferrer"
						className="text-pink-600 hover:text-pink-700 font-medium transition-colors inline-flex items-center gap-1"
					>
						Himanshu Yadav
						<ExternalLink className="w-3 h-3" />
					</Link>
				</p>
			</div>
		);
	}

	if (variant === 'compact') {
		return (
			<div className={`flex items-center justify-center gap-2 text-xs text-gray-500 ${className}`}>
				<span>Created by</span>
				<Link 
					href={creatorUrl} 
					target="_blank" 
					rel="noopener noreferrer"
					className="text-pink-600 hover:text-pink-700 font-medium transition-colors inline-flex items-center gap-1"
				>
					Himanshu Yadav
					<ExternalLink className="w-3 h-3" />
				</Link>
			</div>
		);
	}

	return (
		<div className={`flex flex-col items-center gap-2 p-4 ${className}`}>
			<div className="flex items-center gap-2 text-sm text-gray-600">
				<Code className="w-4 h-4 text-pink-600" />
				<span>Built by</span>
				<Link 
					href={creatorUrl} 
					target="_blank" 
					rel="noopener noreferrer"
					className="text-pink-600 hover:text-pink-700 font-semibold transition-colors inline-flex items-center gap-1 hover:underline"
				>
					Himanshu Yadav
					<ExternalLink className="w-3 h-3" />
				</Link>
			</div>
			<p className="text-xs text-gray-500">
				Made with <Heart className="inline w-3 h-3 text-red-500" /> for SCSIT DAVV
			</p>
		</div>
	);
}

