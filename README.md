# Peer Sphere

A social platform for SCSIT DAVV students to connect, collaborate, and build communities.

## Platforms

- 🌐 **Web App**: Next.js-based web application
- 📱 **Mobile App**: React Native mobile application (iOS & Android)

Both platforms share the same Firebase backend, allowing users to access their data seamlessly across devices.

## Web App Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

You can get these values from your Firebase project settings.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Mobile App Setup

The mobile app is located in the `PeerSphereMobile/` directory. See [PeerSphereMobile/README.md](./PeerSphereMobile/README.md) for detailed setup instructions.

### Quick Start

```bash
cd PeerSphereMobile
npm install
```

Configure Firebase in `lib/firebase.ts` using the same credentials as the web app.

Run the app:
```bash
npm start
# Press 'i' for iOS, 'a' for Android, or scan QR code with Expo Go app
```

## Shared Database

Both the web and mobile apps use the same Firebase backend:
- **Firebase Authentication**: Same user accounts across platforms
- **Cloud Firestore**: Shared communities, events, and messages
- **Real-time Sync**: Changes on one platform reflect on the other

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)

## Deploy

### Web App

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

### Mobile App

Choose your deployment method:

#### 🆓 FREE Deployment (Recommended for Start)

**Get live in 30 minutes for FREE!**

Quick Start:
1. Read: [GET_LIVE_NOW.md](./GET_LIVE_NOW.md) - 30 minute guide
2. Build APK: `eas build --platform android --profile preview`
3. Upload to [GitHub Releases](./GITHUB_RELEASES_GUIDE.md)
4. Share link!

Detailed Guides:
- 📦 [GitHub Releases Guide](./GITHUB_RELEASES_GUIDE.md) - Complete tutorial
- 🆓 [Free Deployment Options](./FREE_DEPLOYMENT.md) - All free methods
- 📋 [Summary](./SUMMARY.md) - Quick reference

#### 💰 Paid Deployment

For official app stores:
- 📘 [Quick Deploy Guide](./QUICK_DEPLOY.md) - Fast paid deployment
- 📖 [Full Deployment Guide](./MOBILE_DEPLOYMENT.md) - Complete reference

**Costs:**
- Android (Google Play): $25 one-time
- iOS (App Store): $99/year

**Recommended**: Start with free GitHub Releases, then move to app stores!
