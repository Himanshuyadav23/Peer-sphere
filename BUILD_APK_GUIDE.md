# Build APK for Peer Sphere Mobile

This guide will help you build a shareable APK file that others can install on their Android phones.

## Prerequisites

1. **Expo Account** (free) - Sign up at https://expo.dev
2. **EAS CLI** - Install globally with npm

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

## Step 2: Login to Expo

```bash
cd PeerSphereMobile
eas login
```

Enter your Expo account credentials. If you don't have an account, create one at https://expo.dev

## Step 3: Configure EAS Build

The `eas.json` file is already created. You just need to link your project:

```bash
eas build:configure
```

This will:
- Create an Expo project (if needed)
- Link your local project to Expo
- Set up the build configuration

## Step 4: Build the APK

### For Testing/Sharing (Preview Build):

```bash
npm run build:apk
```

Or directly:
```bash
eas build --platform android --profile preview
```

### For Production (Production Build):

```bash
npm run build:apk:prod
```

Or directly:
```bash
eas build --platform android --profile production
```

## Step 5: Wait for Build

- The build runs on Expo's servers (takes 10-20 minutes)
- You'll see a build URL in your terminal
- You can check progress at: https://expo.dev/accounts/[your-username]/projects/peer-sphere/builds

## Step 6: Download APK

Once the build completes:

1. **Option A**: Download from terminal
   - The build will provide a download link
   - Click the link or copy-paste in browser

2. **Option B**: Download from Expo Dashboard
   - Go to https://expo.dev/accounts/[your-username]/projects/peer-sphere/builds
   - Click on the completed build
   - Click "Download" button

## Step 7: Share the APK

1. **Upload to Cloud Storage** (Recommended):
   - Upload APK to Google Drive, Dropbox, or any file sharing service
   - Share the download link with others

2. **Direct Share**:
   - Send APK file via email, WhatsApp, etc.
   - File size will be around 50-100 MB

3. **Host on Website**:
   - Upload to your website/server
   - Provide direct download link

## Installing the APK

**For the people you share with:**

1. Download the APK file to their phone
2. Enable "Install from Unknown Sources" in Android settings:
   - Settings → Security → Unknown Sources (enable)
   - Or Settings → Apps → Special Access → Install Unknown Apps
3. Tap the downloaded APK file
4. Tap "Install"
5. Open the app!

## Important Notes

- **APK Size**: First build will be larger (~80-100MB), updates are smaller
- **Signing**: EAS automatically signs your APK for you
- **Updates**: To update the app, build a new APK with incremented version number
- **Version**: Update `version` in `app.json` and `versionCode` in `android` section before each new build

## Updating the App

When you want to release an update:

1. Update version in `app.json`:
   ```json
   "version": "1.0.1",
   "android": {
     "versionCode": 2
   }
   ```

2. Build new APK:
   ```bash
   npm run build:apk
   ```

3. Share the new APK (users will need to uninstall old version first, or install over it)

## Troubleshooting

### Build Fails
- Check Firebase configuration is correct
- Ensure all dependencies are installed (`npm install`)
- Check Expo dashboard for error details

### APK Won't Install
- Make sure "Unknown Sources" is enabled
- Check if device has enough storage
- Try downloading on a different device

### Build Takes Too Long
- First build is always slower (10-20 min)
- Subsequent builds are faster (5-10 min)
- Check Expo status page if builds are stuck

## Free Tier Limits

Expo's free tier includes:
- ✅ Unlimited builds
- ✅ APK builds for Android
- ✅ Build history
- ✅ No credit card required

## Next Steps

After building:
1. Test the APK on your own phone first
2. Share with a few test users
3. Collect feedback
4. Build updated version if needed

---

**Need Help?**
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Expo Community: https://forums.expo.dev/

