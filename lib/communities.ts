import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { getDb } from './firebase';
import type { Community } from './types';

export async function joinCommunity(communityId: string, uid: string) {
	const db = getDb();
	const ref = doc(collection(db, 'communities'), communityId);
	await updateDoc(ref, {
		members: arrayUnion(uid),
	});
}

export async function leaveCommunity(communityId: string, uid: string) {
	const db = getDb();
	const ref = doc(collection(db, 'communities'), communityId);
	await updateDoc(ref, {
		members: arrayRemove(uid),
	});
}

export async function createCommunity(data: {
	name: string;
	description: string;
	category: string;
	createdBy: string;
}): Promise<string> {
	try {
		const db = getDb();
		console.log('Creating community with data:', data);
		const docRef = await addDoc(collection(db, 'communities'), {
			...data,
			members: [data.createdBy], // Creator is automatically a member
			createdAt: serverTimestamp(),
		});
		console.log('Community created with ID:', docRef.id);
		return docRef.id;
	} catch (error) {
		console.error('Error creating community:', error);
		throw error;
	}
}

export async function updateCommunity(communityId: string, data: Partial<Community>): Promise<void> {
	const db = getDb();
	const ref = doc(collection(db, 'communities'), communityId);
	await updateDoc(ref, {
		...data,
		updatedAt: new Date(),
	});
}

export async function deleteCommunity(communityId: string): Promise<void> {
	const db = getDb();
	const ref = doc(collection(db, 'communities'), communityId);
	await updateDoc(ref, {
		deleted: true,
		deletedAt: new Date(),
	});
}

export async function getCommunity(communityId: string): Promise<Community | null> {
	const db = getDb();
	const ref = doc(collection(db, 'communities'), communityId);
	const snap = await getDoc(ref);
	if (!snap.exists()) return null;
	return { id: snap.id, ...(snap.data() as any) } as Community;
}

export async function getMyCommunities(uid: string): Promise<Community[]> {
	const db = getDb();
	const q = query(collection(db, 'communities'), where('members', 'array-contains', uid));
	const snap = await getDocs(q);
	return snap.docs
		.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Community))
		.filter(c => !c.deleted); // Filter out deleted communities
}
