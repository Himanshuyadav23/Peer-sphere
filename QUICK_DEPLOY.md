# Quick Deployment Guide for Peer Sphere Mobile

## 🚀 Fast Track to App Stores

This is a simplified guide to get your app live ASAP!

## Prerequisites Checklist

- [ ] Expo account at [expo.dev](https://expo.dev) (FREE)
- [ ] Google Play Console account ($25 one-time)
- [ ] Apple Developer account ($99/year) - only if doing iOS

## Step 1: Setup EAS (5 minutes)

```bash
cd PeerSphereMobile
npm install -g eas-cli
eas login
eas build:configure
```

This creates `eas.json` - that's it! Default settings work fine.

## Step 2: Build Android App (30 minutes)

```bash
eas build --platform android --profile production
```

Go grab coffee ☕ - this takes 15-30 minutes.

## Step 3: Submit to Google Play

After build completes:

```bash
eas submit --platform android
```

**OR** manually:
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create new app
3. Upload the AAB file from Expo dashboard
4. Fill basic info
5. Submit!

## Step 4: Build iOS App (30-40 minutes)

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

**OR** manually:
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create new app
3. Upload the IPA file
4. Fill metadata
5. Submit!

## That's It! 🎉

Your app will be reviewed and go live:
- Google Play: Usually 1-3 days
- App Store: Usually 1-7 days

## What You Need to Prepare

### Store Listing
- **App Name**: Peer Sphere (already in app.json ✓)
- **Description**: "Connect with SCSIT DAVV students through communities, events, and messaging"
- **Screenshots**: Take 5-10 screenshots from your app
- **Privacy Policy**: Create at [privacy-policy-generator.net](https://www.privacy-policy-generator.net/) (FREE)

### Screenshots Needed
- Google Play: 2-8 screenshots (min 320px, max 3840px)
- App Store: At least 6.5" iPhone screenshots

## Common Issues

### "Build Failed"
- Check Firebase config is correct
- Make sure all dependencies are in package.json
- Try building preview first: `eas build --platform android --profile preview`

### "Firebase Not Working"
- Verify Firebase keys are in your code
- Check Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Make sure indexes are deployed: `firebase deploy --only firestore:indexes`

### "App Store Rejected"
- Missing privacy policy URL
- Incomplete app description
- Missing screenshots

## Alternative: Test Build First

Before production, test with preview:

```bash
# Android APK for testing
eas build --platform android --profile preview

# iOS TestFlight
eas build --platform ios --profile production
```

Share the link with friends to test!

## Cost Breakdown

| Item | Cost | When |
|------|------|------|
| Expo Account | FREE | Always |
| Google Play | $25 | One-time |
| Apple Developer | $99 | Per year |
| EAS Build | FREE | First 30 builds/month |
| EAS Submit | FREE | Always |

**Minimum to launch Android: $25**

## Next Steps After Launch

1. Monitor reviews
2. Fix bugs users report
3. Update version in app.json
4. Build & submit updates
5. Marketing!

## Need Help?

- Read full guide: [MOBILE_DEPLOYMENT.md](./MOBILE_DEPLOYMENT.md)
- Expo docs: [docs.expo.dev](https://docs.expo.dev)
- Expo forums: [forums.expo.dev](https://forums.expo.dev)

## Quick Commands Reference

```bash
# Configure EAS
eas build:configure

# Build Android
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios

# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

---

**You got this! Let's make Peer Sphere live! 🚀📱**

