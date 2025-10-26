"use client";

import { Input } from '@/components/ui/input';

export default function HeaderSearch() {
	return (
		<div className="hidden md:block w-80">
			<Input placeholder="Search peers, communities, events" />
		</div>
	);
}
