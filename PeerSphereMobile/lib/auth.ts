import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, type User, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from './firebase';

const ALLOWED_DOMAINS = ['@davvscsit.in', '@scsitdavv.edu'];

export function isSCSITEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return ALLOWED_DOMAINS.some((d) => lower.endsWith(d));
}

export async function signupWithEmail(email: string, password: string, name: string): Promise<User> {
  if (!isSCSITEmail(email)) {
    throw new Error('Only SCSIT DAVV emails are allowed');
  }
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await ensureUserDoc(cred.user, name);
  return cred.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export async function ensureUserDoc(user: User, name?: string) {
  const db = getDb();
  const ref = doc(collection(db, 'users'), user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name || user.displayName || user.email || user.uid)}`;
    await setDoc(ref, {
      uid: user.uid,
      name: name || user.displayName || '',
      email: user.email,
      year: '',
      batch: '',
      interests: [],
      avatarUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth();
  return auth.currentUser;
}

export function onAuthChange(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}


