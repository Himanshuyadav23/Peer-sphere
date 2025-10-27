import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Firebase configuration - shared with web app
const firebaseConfig = {
  apiKey: 'AIzaSyB_g6-jThDLrizwKlgHhaef6Oxgt2vDxT4',
  authDomain: 'peer-sphere-4b028.firebaseapp.com',
  projectId: 'peer-sphere-4b028',
  storageBucket: 'peer-sphere-4b028.firebasestorage.app',
  messagingSenderId: '941071821689',
  appId: '1:941071821689:web:090f2c612dede133069da8',
};

export function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
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
