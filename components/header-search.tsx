"use client";

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function HeaderSearch() {
	const router = useRouter();
	const [query, setQuery] = useState('');

	function handleSearch() {
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}

	function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			handleSearch();
		}
	}

	return (
		<div className="hidden md:block w-80">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
				<Input
					placeholder="Search peers, communities, events..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyPress={handleKeyPress}
					className="pl-10"
				/>
			</div>
		</div>
	);
}
