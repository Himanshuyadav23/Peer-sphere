# Mobile App Links Guide

This guide explains how to use and configure mobile app deep links for Peer Sphere.

## Overview

Peer Sphere supports multiple types of mobile app links:

1. **Custom URL Scheme**: `peersphere://path` - Opens the app directly if installed
2. **Universal Links (iOS)**: `https://yourdomain.com/app/path` - Opens app if installed, otherwise web
3. **App Links (Android)**: Same as universal links but for Android
4. **App Store Links**: Direct links to download the app from stores

## Accessing Mobile App Links

### Via Web Interface

1. Navigate to `/mobile-app` in your web browser
2. Or click "Mobile App" in the user menu (top right) or navigation sidebar

The mobile app page provides:
- Download buttons for iOS and Android
- Link generator for creating shareable deep links
- Quick links for common app screens
- Copy and share functionality

### Via Code

Import the utility functions:

```typescript
import { 
  generateAppLink, 
  generateUniversalLink,
  generateShareableLink,
  getAppStoreLink,
  openAppOrStore
} from '@/lib/mobile-links';

// Generate a deep link
const appLink = generateAppLink('/communities/abc123');
// Returns: peersphere://communities/abc123

// Generate a shareable link
const links = generateShareableLink('community', 'abc123');
// Returns: { webUrl, appUrl, universalLink }

// Open app or redirect to store
openAppOrStore('/events/xyz789');
```

## Configuration Required

### 1. Update App Store URLs

Edit `lib/mobile-links.ts` and update:

```typescript
const APP_STORE_URLS = {
  ios: 'https://apps.apple.com/app/peer-sphere/idXXXXXXXXX', // Your App Store ID
  android: 'https://play.google.com/store/apps/details?id=com.peersphere.mobile',
  expo: 'exp://expo.dev/@your-username/peer-sphere', // Your Expo username/project
};
```

### 2. Update Domain for Universal Links

In `lib/mobile-links.ts`, replace `'https://yourdomain.com'` with your actual domain:

```typescript
const baseUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://yourdomain.com'; // ← Update this
```

### 3. Configure Mobile App (app.json)

In `PeerSphereMobile/app.json`, update:

1. **iOS Associated Domains**:
   ```json
   "associatedDomains": [
     "applinks:yourdomain.com"  // ← Replace with your domain
   ]
   ```

2. **Android Intent Filters**:
   ```json
   "host": "*.yourdomain.com",  // ← Replace with your domain
   ```

### 4. Set Up Universal Links (iOS)

1. Add an `apple-app-site-association` file to your website root:
   ```
   https://yourdomain.com/.well-known/apple-app-site-association
   ```

2. File content:
   ```json
   {
     "applinks": {
       "apps": [],
       "details": [
         {
           "appID": "TEAM_ID.com.peersphere.mobile",
           "paths": ["/app/*"]
         }
       ]
     }
   }
   ```

   Replace `TEAM_ID` with your Apple Developer Team ID.

### 5. Set Up App Links (Android)

1. Add an `assetlinks.json` file to your website:
   ```
   https://yourdomain.com/.well-known/assetlinks.json
   ```

2. File content:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.peersphere.mobile",
       "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
     }
   }]
   ```

   Get your SHA256 fingerprint from your Android app signing certificate.

## Using Mobile App Links

### Share Links

You can generate and share links that open specific content in the mobile app:

1. Go to `/mobile-app`
2. Select link type (Community, Event, Profile, or Match)
3. Enter the ID
4. Copy the generated link
5. Share it via email, messages, social media, etc.

### Quick Links

Common app screens have pre-generated links:
- Home: `peersphere://`
- Communities: `peersphere://communities`
- Events: `peersphere://events`
- Matches: `peersphere://matches`
- Messages: `peersphere://messages`
- Profile: `peersphere://profile`

### In Code

```typescript
// Generate a link to a specific community
const communityLink = generateShareableLink('community', communityId);

// Share the link
await navigator.share({
  title: 'Check out this community!',
  url: communityLink.universalLink
});

// Or copy to clipboard
navigator.clipboard.writeText(communityLink.appUrl);
```

## Testing

### Test Custom URL Scheme

1. Build and install the mobile app
2. Open a browser and navigate to: `peersphere://communities`
3. The app should open to the communities screen

### Test Universal Links

1. Make sure your `.well-known` files are accessible
2. Send a universal link to yourself (e.g., via email)
3. Click the link on your mobile device
4. The app should open if installed, otherwise the web version opens

### Test on Development

For development/testing, use Expo Go:
- Share the Expo development URL: `exp://expo.dev/@your-username/peer-sphere`
- Users scan the QR code with Expo Go app
- The app opens in Expo Go

## Troubleshooting

### Links Not Opening App

1. **Check URL scheme**: Ensure `peersphere://` is registered in `app.json`
2. **Check universal links setup**: Verify `.well-known` files are accessible
3. **Check app installation**: Ensure the app is installed on the device
4. **Test on device**: Some features only work on physical devices, not simulators

### Universal Links Not Working

1. **Verify domain**: Ensure your domain matches in `app.json` and `.well-known` files
2. **Check HTTPS**: Universal links require HTTPS
3. **Verify file accessibility**: Test that `.well-known` files return correct JSON
4. **Clear app cache**: Sometimes iOS/Android cache link associations

### App Store Links Not Working

1. **Update URLs**: Ensure App Store URLs in `lib/mobile-links.ts` are correct
2. **Check app status**: Ensure your app is published and available in stores
3. **Test links**: Verify the App Store URLs work in a browser first

## Best Practices

1. **Always provide fallback**: Use universal links that fallback to web if app isn't installed
2. **Test on both platforms**: iOS and Android handle links differently
3. **Update store links**: Keep App Store URLs current
4. **Use universal links**: They provide better user experience than custom schemes
5. **Handle deep link routing**: Ensure your mobile app properly routes to the correct screen

## Support

For issues or questions:
- Check the mobile app repository: `PeerSphereMobile/`
- Review Expo documentation: https://docs.expo.dev/guides/linking/
- Check Firebase/backend configuration if links require authentication

