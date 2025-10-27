import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from './firebase';
import type { UserDoc } from './types';

export async function updateUserProfile(uid: string, data: Partial<UserDoc>): Promise<void> {
	const db = getDb();
	await updateDoc(doc(db, 'users', uid), {
		...data,
		updatedAt: serverTimestamp(),
	});
}
