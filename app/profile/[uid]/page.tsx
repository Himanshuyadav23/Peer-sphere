"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import type { UserDoc } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function UserProfilePage() {
	const params = useParams<{ uid: string }>();
	const uid = params?.uid as string;
	const router = useRouter();
	const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
	useEffect(() => {
		if (!uid) return;
		getDoc(doc(getDb(), 'users', uid)).then((snap) => {
			if (!snap.exists()) return setUserDoc(null);
			setUserDoc(snap.data() as any);
		});
	}, [uid]);

	return (
		<div className="space-y-4">
			{userDoc && (
				<Card>
					<CardHeader>
						<CardTitle>{userDoc.name}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="text-sm text-muted-foreground">{userDoc.email}</div>
						<div>Year: {userDoc.year || '-'}</div>
						<div>Batch: {userDoc.batch || '-'}</div>
						<div>Interests: {(userDoc.interests || []).join(', ') || '-'}</div>
						<Button onClick={() => router.push(`/messages/${uid}`)}>Message</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
