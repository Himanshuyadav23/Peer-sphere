"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { getDb, getFirebaseAuth } from '@/lib/firebase';

export default function AuthGate({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [ready, setReady] = useState(false);
	const [setupError, setSetupError] = useState<string | null>(null);
	useEffect(() => {
		let unsub = () => {};
		try {
			const auth = getFirebaseAuth();
			unsub = onAuthStateChanged(auth, async (user) => {
				if (!user) {
					if (!pathname?.startsWith('/login') && !pathname?.startsWith('/signup')) {
						router.replace('/login');
					}
					setReady(true);
					return;
				}
				try {
					const snap = await getDoc(doc(getDb(), 'users', user.uid));
					const data = snap.data() as any;
					const isSetup = data && data.name && data.year && data.batch;
					if (!isSetup && !pathname?.startsWith('/profile/setup')) {
						router.replace('/profile/setup');
					} else if (isSetup && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
						router.replace('/dashboard');
					}
				} finally {
					setReady(true);
				}
			});
		} catch (e: any) {
			setSetupError('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars and reload.');
			setReady(true);
		}
		return () => unsub?.();
	}, [router, pathname]);

	if (!ready) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
	if (setupError) return <div className="p-4 text-sm text-muted-foreground">{setupError}</div>;
	return <>{children}</>;
}

