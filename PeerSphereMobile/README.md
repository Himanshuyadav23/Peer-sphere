# Peer Sphere Mobile App

A React Native mobile application for the Peer Sphere social platform for SCSIT DAVV students.

## Overview

This mobile app is built with React Native and Expo, sharing the same Firebase backend as the web application. Users can access their communities, events, messages, and matches seamlessly across both platforms.

## Features

- 🔐 Authentication (Email/Password with SCSIT DAVV domain validation)
- 👥 Communities
- 📅 Events
- 💬 Real-time Messaging
- 🤝 Smart Matchmaking
- 📱 Cross-platform (iOS & Android)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- iOS Simulator (for iOS development) - macOS only
- Android Studio (for Android development)
- Expo CLI

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Edit `lib/firebase.ts` and replace the placeholder Firebase configuration values with your actual Firebase credentials:

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

**Important**: Use the SAME Firebase project credentials as your web app to share the database.

### 3. Run the App

#### For Development

```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with the Expo Go app on your physical device

#### For Android

```bash
npm run android
```

#### For iOS (macOS only)

```bash
npm run ios
```

#### For Web

```bash
npm run web
```

## Project Structure

```
PeerSphereMobile/
├── app/                    # Screen components (Expo Router)
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── signup.tsx     # Signup screen
│   └── (tabs)/            # Main app tabs
├── lib/                    # Core business logic
│   ├── firebase.ts        # Firebase configuration
│   ├── auth.ts            # Authentication functions
│   ├── communities.ts     # Community management
│   ├── events.ts          # Event management
│   ├── messages.ts        # Messaging functions
│   ├── matchmaking.ts     # Matchmaking algorithm
│   └── types.ts           # TypeScript types
├── components/             # Reusable components
└── assets/                # Static assets
```

## Key Features

### Shared Database

The mobile app uses the same Firebase database as the web app, ensuring:
- 🔄 Synchronized data across platforms
- 👤 Same user accounts
- 💾 Shared communities and events
- 💬 Unified messaging system

### Authentication

- Email/password authentication
- Automatic validation for `@davvscsit.in` and `@scsitdavv.edu` domains
- Persistent login state
- Secure user profile management

### Real-time Updates

- Live community updates
- Real-time event notifications
- Instant messaging
- Live matchmaking results

## Development

### Adding New Screens

Screens are automatically routed based on the file structure in the `app/` directory. For example:
- `app/communities/index.tsx` → `/communities`
- `app/profile/[uid].tsx` → `/profile/:uid`

### Shared Business Logic

All business logic is in the `lib/` directory and can be reused from the web app. The implementation is platform-agnostic.

## Building for Production

### Android

1. Generate a keystore
2. Create `android/app/google-services.json`
3. Run `eas build -p android`

### iOS

1. Create `ios/GoogleService-Info.plist`
2. Configure signing certificates
3. Run `eas build -p ios`

## Troubleshooting

### Firebase Connection Issues

- Verify Firebase configuration values
- Check internet connection
- Ensure Firebase project is active

### Authentication Errors

- Confirm email uses `@davvscsit.in` or `@scsitdavv.edu`
- Check Firebase Authentication settings
- Verify user is not already registered

## Contributing

1. Follow the existing code structure
2. Maintain TypeScript types
3. Test on both iOS and Android
4. Keep business logic in `lib/` directory

## License

Same as the main Peer Sphere project.

## Support

For issues or questions, please refer to the main project documentation or contact the development team.











