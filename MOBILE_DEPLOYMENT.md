# Mobile App Deployment Guide

This guide will walk you through deploying Peer Sphere Mobile to Android (Google Play) and iOS (App Store).

## Prerequisites

1. **EAS CLI** - Expo Application Services CLI for building and deploying
2. **Expo Account** - Create a free account at [expo.dev](https://expo.dev)
3. **Google Play Console Account** (for Android) - $25 one-time fee
4. **Apple Developer Account** (for iOS) - $99/year

## Step 1: Update App Configuration

First, let's configure your app properly:

### Update `app.json`

```json
{
  "expo": {
    "name": "Peer Sphere",
    "slug": "peer-sphere",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.peersphere.mobile",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.peersphere.mobile",
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    },
    "owner": "your-expo-username"
  }
}
```

## Step 2: Install EAS CLI

```bash
npm install -g eas-cli
```

Login to your Expo account:

```bash
eas login
```

## Step 3: Configure EAS

Initialize EAS in your project:

```bash
cd PeerSphereMobile
eas build:configure
```

This creates an `eas.json` file. Here's a recommended configuration:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Step 4: Build for Android

### A. Create a Google Play Console Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay the $25 one-time fee
3. Create a new app

### B. Build Android App Bundle (AAB)

```bash
eas build --platform android --profile production
```

This will:
- Build your app in the cloud
- Generate an AAB (Android App Bundle) file
- Upload it to Google Play Console
- Take 15-30 minutes

### C. Submit to Google Play Store

After the build completes:

```bash
eas submit --platform android
```

Follow the prompts to:
1. Select your build
2. Complete app store listing
3. Upload screenshots and descriptions

## Step 5: Build for iOS

### A. Create an Apple Developer Account

1. Go to [Apple Developer](https://developer.apple.com)
2. Sign up for $99/year
3. Enable App Store Connect

### B. Build iOS App

```bash
eas build --platform ios --profile production
```

This will:
- Build your app in the cloud
- Generate an IPA file
- Handle code signing automatically
- Take 20-40 minutes

### C. Submit to App Store

```bash
eas submit --platform ios
```

Follow the prompts and then:
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Complete app metadata
3. Submit for review

## Step 6: Update Deployment

### App Store Connect Setup

1. **App Information**
   - Name: Peer Sphere
   - Primary Language: English
   - Bundle ID: com.peersphere.mobile
   - SKU: peer-sphere-mobile

2. **Pricing**
   - Price: Free
   
3. **App Privacy**
   - Create privacy policy
   - Disclose data collection

4. **Screenshots & Descriptions**
   - Minimum 6.5" iPhone screenshots
   - App description
   - Keywords
   - Support URL

### Google Play Store Setup

1. **Store Listing**
   - App Name: Peer Sphere
   - Short Description (80 chars max)
   - Full Description (4000 chars max)
   - Screenshots: Phone and tablet
   - Feature Graphic: 1024x500

2. **Content Rating**
   - Complete questionnaire
   - Usually rated "Everyone"

3. **Pricing & Distribution**
   - Free
   - Select countries
   - Age groups

## Step 7: Environment Variables

For production builds, you need to set environment variables:

```bash
eas build:configure
```

Add to `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "NEXT_PUBLIC_FIREBASE_API_KEY": "your-api-key",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "your-auth-domain",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "your-project-id",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "your-storage-bucket",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "your-sender-id",
        "NEXT_PUBLIC_FIREBASE_APP_ID": "your-app-id"
      }
    }
  }
}
```

**IMPORTANT**: Don't commit sensitive keys! Use EAS Secrets:

```bash
eas secret:create --scope project --name FIREBASE_API_KEY --value your-api-key
```

Then reference in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "NEXT_PUBLIC_FIREBASE_API_KEY": "${FIREBASE_API_KEY}"
      }
    }
  }
}
```

## Step 8: Update and Rebuild

When you make changes:

1. Update version in `app.json`:
   ```json
   "version": "1.0.1"
   ```

2. For Android, also update `versionCode`:
   ```json
   "android": {
     "versionCode": 2
   }
   ```

3. For iOS, also update `buildNumber`:
   ```json
   "ios": {
     "buildNumber": "1.0.1"
   }
   ```

4. Build and submit:
   ```bash
   eas build --platform android --profile production
   eas submit --platform android
   ```

## Alternative: Development Builds (For Testing)

### Build APK for Testing

```bash
eas build --platform android --profile preview
```

This creates an APK you can share directly without the Play Store.

### iOS TestFlight

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

Then invite testers via TestFlight.

## Important Links

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Expo Dashboard](https://expo.dev)

## Quick Deployment Checklist

### Android
- [ ] Create Google Play Console account
- [ ] Configure `app.json` with Android package name
- [ ] Run `eas build --platform android`
- [ ] Run `eas submit --platform android`
- [ ] Complete Play Console listing
- [ ] Submit for review

### iOS
- [ ] Create Apple Developer account
- [ ] Configure `app.json` with iOS bundle ID
- [ ] Run `eas build --platform ios`
- [ ] Run `eas submit --platform ios`
- [ ] Complete App Store Connect listing
- [ ] Submit for review

## Cost Summary

| Service | Cost | Frequency |
|---------|------|-----------|
| Google Play | $25 | One-time |
| Apple Developer | $99 | Yearly |
| EAS Build | Free (limited) | Per build after quota |
| EAS Submit | Free | Unlimited |

## Troubleshooting

### Build Fails
- Check `eas.json` configuration
- Verify all dependencies are installed
- Check Expo SDK version compatibility

### Firebase Not Working in Production
- Verify environment variables are set
- Check Firebase configuration
- Ensure Firestore rules are deployed

### App Store Rejection
- Common reasons: Missing privacy policy, incomplete metadata
- Fix issues and resubmit

## Need Help?

- Check [Expo Forums](https://forums.expo.dev/)
- Join [Expo Discord](https://chat.expo.dev/)
- Review [Expo Documentation](https://docs.expo.dev/)

---

**Good luck with your deployment! 🚀**

