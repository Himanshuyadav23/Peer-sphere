import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic cookie check for a future auth token; Firebase client SDK uses local storage,
// so for MVP we'll gate by path and let client-side redirect enforce auth after mount.

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const isProtected = pathname.startsWith('/profile') || pathname === '/' || pathname.startsWith('/communities') || pathname.startsWith('/events') || pathname.startsWith('/messages') || pathname.startsWith('/matches');

	// Allow everything to pass; client side will check and redirect.
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next|api|favicon.ico|login|signup).*)'],
};

