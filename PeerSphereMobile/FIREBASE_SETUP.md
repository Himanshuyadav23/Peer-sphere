# Firebase Setup for Mobile App

This mobile app uses the same Firebase project as the web application to ensure data synchronization across platforms.

## Configuration Steps

### 1. Get Firebase Credentials

If you haven't already set up the web app, follow these steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ > Project Settings
4. Scroll down to "Your apps" section
5. If you don't have an app registered, click "Add app" > Choose iOS or Android

### 2. Configure Mobile App

Open `lib/firebase.ts` and replace the placeholders:

```typescript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'YOUR_AUTH_DOMAIN_HERE',
  projectId: 'YOUR_PROJECT_ID_HERE',
  storageBucket: 'YOUR_STORAGE_BUCKET_HERE',
  messagingSenderId: 'YOUR_SENDER_ID_HERE',
  appId: 'YOUR_APP_ID_HERE',
};
```

### 3. Get Values from Firebase

In Firebase Console > Project Settings > General, find:
- **API Key**: Listed under "Your apps"
- **Auth Domain**: `your-project-id.firebaseapp.com`
- **Project ID**: Visible at the top of the settings
- **Storage Bucket**: `your-project-id.appspot.com`
- **Messaging Sender ID**: Listed under "Your apps"
- **App ID**: Listed under "Your apps" (Mobile app)

### 4. Copy from Web App Configuration

The easiest way is to copy these values from your web app's `.env.local` file:

```env
# From web app .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```

Then update `lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: 'AIza...',                      // From NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: 'your-project.firebaseapp.com',  // From NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: 'your-project',              // From NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: 'your-project.appspot.com',   // From NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: '123456789',         // From NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: '1:123456789:web:abc...',       // This will be different for mobile
};
```

**Note**: The `appId` for mobile will be different. If you haven't registered a mobile app yet:
1. In Firebase Console > Project Settings > General
2. Scroll to "Your apps"
3. Click "Add app" > Choose platform (iOS/Android)
4. Register the app (you'll need bundle ID for iOS or package name for Android)
5. Download the config file or copy the App ID

### 5. Firebase Authentication

Ensure Email/Password authentication is enabled:

1. Go to Firebase Console > Authentication
2. Click "Get started" (if not already enabled)
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Save

### 6. Firestore Database

Ensure Firestore is set up:

1. Go to Firebase Console > Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" or configure rules
4. Select a location
5. Enable

### 7. Firestore Security Rules

Make sure your security rules allow the mobile app to read/write data. Check `firestore.rules` in the web app directory.

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Double-check that all Firebase config values are correct
- Ensure there are no extra spaces or quotes
- Verify the API key is from the correct Firebase project

### Error: "Network request failed"
- Check internet connection
- Verify Firebase project is active
- Ensure Firestore and Auth are enabled in Firebase Console

### Error: "Firebase: Error (auth/unauthorized-domain)"
- For development, this shouldn't occur with mobile apps
- For production, ensure your domains are whitelisted in Firebase Console

### Data Not Syncing
- Verify both apps use the same `projectId`
- Check that Firestore rules allow read/write operations
- Ensure user is authenticated in both apps

## Testing the Setup

1. Start the development server: `npm start`
2. Try to sign up with a test email ending in `@davvscsit.in` or `@scsitdavv.edu`
3. Check Firebase Console > Authentication to see if the user was created
4. Check Firebase Console > Firestore to see if user document was created

## Important Notes

- **Security**: Never commit Firebase config with actual credentials to version control
- **Environment**: Consider using environment variables for production builds
- **Same Project**: Always use the same Firebase project ID for web and mobile apps
- **Rules**: Keep Firestore security rules in sync between platforms









