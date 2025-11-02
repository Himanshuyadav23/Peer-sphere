import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { getDb } from './firebase';

function getConversationId(a: string, b: string) {
  return [a, b].sort().join('_');
}

export async function sendMessage(senderId: string, receiverId: string, text: string) {
  const db = getDb();
  const conversationId = getConversationId(senderId, receiverId);
  
  // Create message
  await addDoc(collection(db, 'messages'), {
    conversationId,
    senderId,
    receiverId,
    text,
    timestamp: serverTimestamp(),
  });
  
  // Create notification for receiver (skip if it fails)
  try {
    await addDoc(collection(db, 'notifications'), {
      userId: receiverId,
      type: 'dm',
      message: text,
      link: `/messages/${senderId}`,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    // Don't throw - message was sent successfully
  }
}

export function listenToConversation(a: string, b: string, cb: (docs: any[]) => void) {
  const db = getDb();
  const conversationId = getConversationId(a, b);
  const q = query(
    collection(db, 'messages'), 
    where('conversationId', '==', conversationId), 
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
}

export function listenToRecentConversations(uid: string, cb: (docs: any[]) => void) {
  const db = getDb();
  // Fetch all messages and filter on the client side
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snap) => {
    const seen = new Set<string>();
    const rows: any[] = [];
    for (const d of snap.docs) {
      const m = d.data() as any;
      // Only include messages where the user is sender or receiver
      if (m.senderId !== uid && m.receiverId !== uid) continue;
      const other = m.senderId === uid ? m.receiverId : m.senderId;
      const key = other;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ id: d.id, ...m, otherUserId: other });
      if (rows.length >= 20) break;
    }
    cb(rows);
  });
}




