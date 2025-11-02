# Running PeerSphere Mobile App

## Quick Start

1. **Navigate to the mobile app directory:**
   ```bash
   cd PeerSphereMobile
   ```

2. **Start the Expo development server:**
   ```bash
   npm start
   ```

3. **Choose how to run the app:**

   ### Option A: Run on Your Physical Device (Recommended)
   - Install **Expo Go** app from App Store (iOS) or Google Play (Android)
   - Scan the QR code that appears in your terminal
   - Wait for the app to load on your device

   ### Option B: Run on iOS Simulator (Mac only)
   - Press `i` in the terminal to open iOS simulator
   - Make sure Xcode is installed

   ### Option C: Run on Android Emulator
   - Make sure Android Studio is installed and emulator is running
   - Press `a` in the terminal to open Android emulator

## Troubleshooting

### Port Already in Use
If port 19000 is already in use:
```bash
npx expo start --port 8081
```

### Clear Cache
If you encounter any issues:
```bash
npx expo start -c
```

### Fresh Install
If dependencies are missing:
```bash
npm install
npx expo start
```

### Firebase Configuration
Make sure your Firebase configuration is set up in:
- `PeerSphereMobile/lib/firebase.ts`
- Check `FIREBASE_SETUP.md` for details

## Development Commands

- `npm start` - Start Expo dev server
- `npm run ios` - Open on iOS simulator
- `npm run android` - Open on Android emulator
- `npm run web` - Open in web browser

## Hot Reload
- The app will automatically reload when you make changes to the code
- Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for developer menu

## Features Available
✅ Authentication (Login/Signup)
✅ Profile Management
✅ Communities
✅ Events
✅ Messaging
✅ Matchmaking

## Need Help?
Check the main `README.md` and `FEATURES.md` for more information.

