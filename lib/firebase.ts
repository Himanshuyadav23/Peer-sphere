import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
	if (!getApps().length) {
		app = initializeApp({
			apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyB_g6-jThDLrizwKlgHhaef6Oxgt2vDxT4',
			authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'peer-sphere-4b028.firebaseapp.com',
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'peer-sphere-4b028',
			storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'peer-sphere-4b028.firebasestorage.app',
			messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '941071821689',
			appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:941071821689:web:090f2c612dede133069da8',
		});
	}
	if (!app) {
		app = getApps()[0]!;
	}
	return app;
}

export function getFirebaseAuth(): Auth {
	if (!auth) {
		auth = getAuth(getFirebaseApp());
	}
	return auth;
}

export function getDb(): Firestore {
	if (!db) {
		db = getFirestore(getFirebaseApp());
	}
	return db;
}

