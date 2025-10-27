import { addDoc, arrayUnion, arrayRemove, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDb } from './firebase';
import type { EventDoc } from './types';

export async function createEvent(input: Omit<EventDoc, 'id' | 'attendees' | 'createdAt'> & { createdBy: string }) {
	const db = getDb();
	const ref = await addDoc(collection(db, 'events'), {
		title: input.title,
		description: input.description,
		date: input.date,
		time: input.time,
		venue: input.venue,
		createdBy: input.createdBy,
		communityId: input.communityId,
		attendees: [],
		createdAt: serverTimestamp(),
	});
	return ref.id;
}

export async function getAllEvents(): Promise<EventDoc[]> {
	const db = getDb();
	const snap = await getDocs(collection(db, 'events'));
	return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as EventDoc));
}

export async function rsvpEvent(eventId: string, uid: string) {
	const db = getDb();
	await updateDoc(doc(db, 'events', eventId), { attendees: arrayUnion(uid) });
}

export async function rsvpToEvent(eventId: string, uid: string) {
	const db = getDb();
	await updateDoc(doc(db, 'events', eventId), { attendees: arrayUnion(uid) });
}

export async function cancelRsvp(eventId: string, uid: string) {
	const db = getDb();
	await updateDoc(doc(db, 'events', eventId), { attendees: arrayRemove(uid) });
}

export async function getEvent(eventId: string): Promise<EventDoc | null> {
	const db = getDb();
	const snap = await getDoc(doc(db, 'events', eventId));
	if (!snap.exists()) return null;
	return { id: snap.id, ...(snap.data() as any) } as EventDoc;
}
