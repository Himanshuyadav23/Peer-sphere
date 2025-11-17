# Quick Firebase Setup

## ⚠️ IMPORTANT: Configure Firebase Before Using the App

The mobile app is ready but needs your Firebase credentials to work.

## Steps to Configure:

### Step 1: Get Your Firebase Credentials

Open your Firebase Console at https://console.firebase.google.com/

Go to your project → ⚙️ Settings → Project settings → General

Look for "Your apps" section and find your Web app credentials.

### Step 2: Update the Mobile App Configuration

Open `PeerSphereMobile/lib/firebase.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: 'YOUR_ACTUAL_API_KEY',      // Copy from web app
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc...',    // Use web app's appId for now
};
```

### Step 3: Alternative - Create .env File

Create a file `PeerSphereMobile/.env` with:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Restart the App

After updating credentials, press `r` in the terminal to reload the app.

## ✅ Once Configured:

- Login and signup will work
- Data will sync with your web app
- Users can access communities, events, messages from mobile
- Everything shares the same database!

## Testing

Try to:
1. Sign up with a test email ending in `@davvscsit.in` or `@scsitdavv.edu`
2. Check Firebase Console → Authentication to see the user
3. Check Firebase Console → Firestore to see user document created











