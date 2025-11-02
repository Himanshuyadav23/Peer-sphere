# 📦 How to Use GitHub Releases - Complete Guide

GitHub Releases is the **easiest and most professional** way to distribute your mobile app for FREE!

## What are GitHub Releases?

Think of it as your own mini app store! You can:
- ✅ Upload APK files
- ✅ Add release notes
- ✅ Tag different versions
- ✅ Track downloads
- ✅ Share with users

And it's **100% FREE**! 🎉

---

## Step-by-Step Guide

### Step 1: Create a Git Tag

Tags mark specific versions of your code.

```bash
# Tag your current version as v1.0.0
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

**What this does**: Creates a "snapshot" of your code at this point in time.

### Step 2: Go to GitHub Releases

Visit your repository on GitHub and click **"Releases"**:

```
https://github.com/YOUR_USERNAME/YOUR_REPO/releases
```

Or directly for Peer Sphere:
```
https://github.com/Himanshuyadav23/Peer-sphere/releases
```

### Step 3: Create a New Release

1. Click **"Draft a new release"** (or "Create a new release")
2. You'll see a form to fill out:

#### Basic Information

**Tag version**: Select or create `v1.0.0`
- Click "Choose a tag" dropdown
- Select `v1.0.0` (or type to create new)

**Release title**: `Peer Sphere v1.0.0 - Initial Release`

**Description**: Add release notes (see template below)

**Attach binaries**: Click "Attach binaries by dropping them here"
- Drag your APK file OR click to browse
- File should be: `peer-sphere.apk` or similar

#### Example Release Notes

```markdown
# 🎉 Peer Sphere v1.0.0 - Initial Release

First public release of Peer Sphere mobile app for SCSIT DAVV students!

## ✨ Features

- 🔐 User Authentication (Email/Password)
- 👤 Profile Management
- 🤝 Communities (Join, Create, Browse)
- 📅 Events (RSVP, Create, View)
- 💬 Real-time Messaging
- 🎯 Smart Matchmaking
- 📱 Beautiful Modern UI

## 📥 Download

Download the APK file below for Android devices.

## 🔧 Installation

1. Download the APK file
2. Enable "Install from Unknown Sources" in your Android settings
3. Tap the APK file to install
4. Open and enjoy!

## 📱 Requirements

- Android 5.0 or higher
- Internet connection required

## 🤝 Support

Found a bug or have suggestions?
- Open an issue on GitHub
- Contact us via email

## 🙏 Thank You!

Thank you for being part of the Peer Sphere community!
```

### Step 4: Publish!

1. Scroll down
2. Make sure **"Set as the latest release"** is checked
3. Click **"Publish release"**

**Done!** 🎊

---

## Your Release URL

Your app is now available at:

```
https://github.com/Himanshuyadav23/Peer-sphere/releases/latest
```

This link ALWAYS points to your latest release!

For specific versions:
```
https://github.com/Himanshuyadav23/Peer-sphere/releases/tag/v1.0.0
```

---

## For Users: How to Download

Users can:

1. **Visit the release URL**
2. **See your release notes**
3. **Download the APK** (click the file name or download button)
4. **Install on their phone**

Super simple! No technical knowledge needed.

---

## Updating Your App

When you want to release an update:

### 1. Update Version

Edit `PeerSphereMobile/app.json`:
```json
{
  "version": "1.0.1"
}
```

### 2. Build New APK

```bash
cd PeerSphereMobile
eas build --platform android --profile preview
```

### 3. Tag New Version

```bash
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push origin v1.0.1
```

### 4. Create New Release

1. Go to Releases page
2. Click "Draft a new release"
3. Select `v1.0.1`
4. Title: `Peer Sphere v1.0.1`
5. Description:
   ```markdown
   # 🚀 What's New in v1.0.1
   
   ## 🐛 Bug Fixes
   - Fixed messaging feature
   - Improved community loading
   
   ## 🔧 Improvements
   - Better UI for events
   - Performance optimizations
   ```
6. Upload new APK
7. Publish!

### 5. Keep Old Versions

**Don't delete old releases!** 
- Users might be on older versions
- Useful for troubleshooting
- Shows your progress

GitHub keeps all versions for you automatically.

---

## Advanced: Pre-release vs Release

### Pre-release (Beta Testing)

Check "Set as a pre-release" before publishing.

**Use for:**
- Testing with small groups
- Getting feedback
- Beta versions

Pre-releases are marked with a warning badge.

### Regular Release

Uncheck pre-release for stable, public versions.

---

## Advanced: Release Notes Templates

### Bug Fix Release

```markdown
# 🔧 Peer Sphere v1.0.1 - Bug Fixes

## 🐛 Fixed
- Crash on messages screen
- Community join button not working
- Profile picture upload issue

## ⚡ Performance
- Faster app startup
- Reduced memory usage

[Full Changelog](https://github.com/Himanshuyadav23/Peer-sphere/compare/v1.0.0...v1.0.1)
```

### Major Feature Release

```markdown
# 🎉 Peer Sphere v2.0.0 - Major Update

## 🌟 New Features
- 🎨 Complete UI redesign
- 🔔 Push notifications
- 👥 Group messaging
- 📊 Activity timeline

## 🔧 Improvements
- 50% faster loading
- Better offline support
- Improved search

## 🐛 Bug Fixes
- Fixed 15 reported issues

[Full Changelog](https://github.com/Himanshuyadav23/Peer-sphere/compare/v1.0.5...v2.0.0)
```

---

## Quick Reference Commands

```bash
# Create a tag
git tag v1.0.0

# Push tag to GitHub
git push origin v1.0.0

# Create annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# List all tags
git tag

# Delete a tag locally
git tag -d v1.0.0

# Delete a tag on GitHub
git push --delete origin v1.0.0
```

---

## Best Practices

### ✅ DO

- ✅ Use semantic versioning (v1.0.0, v1.0.1, v2.0.0)
- ✅ Write clear release notes
- ✅ Tag versions with meaningful messages
- ✅ Test APK before uploading
- ✅ Keep old releases for users
- ✅ Update version in app.json

### ❌ DON'T

- ❌ Delete old releases
- ❌ Upload broken APKs
- ❌ Skip release notes
- ❌ Use random version numbers
- ❌ Skip testing

---

## Versioning Guide

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (v2.0.0): Breaking changes, major features
- **MINOR** (v1.1.0): New features, backward compatible
- **PATCH** (v1.0.1): Bug fixes, small improvements

### Examples

```
v1.0.0 - Initial release
v1.0.1 - Bug fix
v1.0.2 - Another bug fix
v1.1.0 - Added new feature (backward compatible)
v1.1.1 - Bug fix in new feature
v2.0.0 - Major redesign (breaking changes)
```

---

## Download Analytics

**Unfortunately**, GitHub doesn't show download counts publicly anymore.

But you can still see:
- ✅ Number of releases
- ✅ Release dates
- ✅ Which version is latest
- ✅ Release notes

For analytics, use:
- Firebase Analytics (in your app)
- Google Analytics
- Your own tracking

---

## FAQ

### Can I upload multiple files?

Yes! Upload APK, screenshots, release notes PDF, etc.

### File size limit?

GitHub recommends < 2GB per file. APKs are usually < 100MB, so no problem!

### Can users auto-update?

Not automatically, but you can:
1. Show update notification in app
2. Link to latest GitHub release
3. Users download and install

### Can I delete a release?

Yes, but don't! Keep old versions.

### Does it work on iOS?

GitHub Releases works, but iOS requires App Store ($99) for actual distribution.

---

## Example Release Page

Here's what users will see:

```
https://github.com/Himanshuyadav23/Peer-sphere/releases/latest

┌─────────────────────────────────────────────────┐
│ Peer Sphere v1.0.0 - Initial Release            │
│ Released on Dec 15, 2024                        │
├─────────────────────────────────────────────────┤
│                                                  │
│ 🎉 Features:                                    │
│ • Authentication                                │
│ • Communities                                   │
│ • Events                                        │
│ • Messaging                                     │
│                                                  │
│ 📥 Assets                                       │
│ • peer-sphere-v1.0.0.apk (45 MB)               │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Quick Start Checklist

- [ ] Build APK with EAS
- [ ] Tag version: `git tag v1.0.0`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Go to GitHub Releases
- [ ] Create new release
- [ ] Upload APK
- [ ] Write release notes
- [ ] Publish!
- [ ] Share the link!

---

## Next Steps

1. ✅ Create your first release
2. 📱 Test with friends
3. 🚀 Share with community
4. 📊 Get feedback
5. 🔄 Release updates

---

## Resources

- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Semantic Versioning](https://semver.org/)
- Your repo: https://github.com/Himanshuyadav23/Peer-sphere

---

**That's it! You're now a pro at GitHub Releases! 🎉**

Happy releasing! 🚀

