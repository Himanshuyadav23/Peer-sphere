import { arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getDb } from './firebase';
import type { Community } from './types';

export async function joinCommunity(communityId: string, uid: string) {
  const db = getDb();
  const ref = doc(collection(db, 'communities'), communityId);
  
  // Ensure the community exists
  const communitySnap = await getDoc(ref);
  if (!communitySnap.exists()) {
    throw new Error('Community not found');
  }
  
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
  const db = getDb();
  const docRef = await addDoc(collection(db, 'communities'), {
    ...data,
    members: [data.createdBy],
    createdAt: new Date(),
  });
  return docRef.id;
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

export async function getAllCommunities(): Promise<Community[]> {
  const db = getDb();
  const snap = await getDocs(collection(db, 'communities'));
  return snap.docs
    .map(doc => ({ id: doc.id, ...(doc.data() as any) } as Community))
    .filter(c => !c.deleted); // Filter out deleted communities
}

export async function getMyCommunities(uid: string): Promise<Community[]> {
  const db = getDb();
  const q = query(collection(db, 'communities'), where('members', 'array-contains', uid));
  const snap = await getDocs(q);
  return snap.docs
    .map(doc => ({ id: doc.id, ...(doc.data() as any) } as Community))
    .filter(c => !c.deleted); // Filter out deleted communities
}


