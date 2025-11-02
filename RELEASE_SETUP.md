# 🎯 Setting Up Your First GitHub Release

Follow these steps to set up and create your first release on GitHub.

## ✅ What We've Done Already

✅ Git tag `v1.0.0` created  
✅ Git tag pushed to GitHub  
✅ Ready to create release

## 🔨 Step-by-Step Instructions

### Step 1: Login to EAS (If Not Already)

Open a terminal in the `PeerSphereMobile` directory:

```bash
cd PeerSphereMobile
eas login
```

Enter your Expo credentials. Need an account? Sign up at [expo.dev](https://expo.dev) - it's FREE!

### Step 2: Configure EAS

```bash
eas build:configure
```

This will ask some questions:
- **Which workflow would you like to set up?** → Press Enter (uses defaults)
- **Your project is not configured with EAS Build.** → Press Enter to configure
- **What would you like to name this build profile?** → Press Enter (uses "preview")

It creates an `eas.json` file - that's it!

### Step 3: Build Your APK

```bash
eas build --platform android --profile preview
```

**Important**: This will prompt:
- "New Android app detected. Would you like to upload a keystore?" → Type **Y** then Enter
- Keystore will be generated for you automatically
- It will ask to push keystore to EAS → Type **Y** then Enter

**What happens next:**
- Build starts in the cloud
- You get a build URL to track progress
- Takes **15-30 minutes** ⏱️

While waiting, you can:
- ☕ Grab a coffee
- 📖 Read the documentation
- 🎨 Prepare screenshots for release

### Step 4: Download APK

Once build completes:

1. Visit: https://expo.dev/builds (or check the URL from build output)
2. Find your completed build
3. Click "Download" button
4. Save the APK file (name it: `peer-sphere-v1.0.0.apk`)

### Step 5: Create GitHub Release

Now go to GitHub:

1. **Visit**: https://github.com/Himanshuyadav23/Peer-sphere/releases/new

2. **Fill out the form**:

   - **Tag version**: Click dropdown, select `v1.0.0`
   - **Release title**: `Peer Sphere v1.0.0 - Initial Release`
   - **Description** (copy this):

   ```markdown
   # 🎉 Peer Sphere v1.0.0 - Initial Release

   First public release of Peer Sphere mobile app for SCSIT DAVV students!

   ## ✨ Features

   - 🔐 **Authentication** - Secure email/password login for SCSIT students
   - 👤 **Profiles** - Complete profile management with interests, year, and batch
   - 🤝 **Communities** - Join, create, and discover student communities
   - 📅 **Events** - RSVP to and create events within communities
   - 💬 **Messaging** - Real-time one-on-one messaging
   - 🎯 **Matchmaking** - Find compatible students based on interests
   - ⚙️ **Admin Panel** - Manage users and platform (admin only)
   - 📱 **Beautiful UI** - Modern, responsive design

   ## 📥 Download & Install

   ### For Android:

   1. Download the APK file below
   2. Enable "Install from Unknown Sources" in your Android settings:
      - Settings → Security → Enable "Install from unknown sources"
   3. Tap the APK file to install
   4. Open the app and sign up/login

   ### Requirements:

   - Android 5.0 or higher
   - Internet connection required
   - Active SCSIT email address (@davvscsit.in or @scsitdavv.edu)

   ## 🎯 Who Is This For?

   SCSIT (School of Computer Science and Information Technology) DAVV students looking to:
   - Connect with classmates
   - Join academic communities
   - Attend college events
   - Find study partners and friends

   ## 🐛 Found an Issue?

   - Open an issue on GitHub: https://github.com/Himanshuyadav23/Peer-sphere/issues
   - Contact via email (add your email)

   ## 🙏 Thank You!

   Thank you for being part of the Peer Sphere community!
   ```

3. **Upload APK**: Drag and drop your APK file into the "Attach binaries" area

4. **Publish**: 
   - Make sure "Set as the latest release" is checked ✅
   - Click **"Publish release"** button

### Step 6: Celebrate! 🎉

Your app is now live at:
```
https://github.com/Himanshuyadav23/Peer-sphere/releases/latest
```

---

## 📱 Share Your App!

### Share This Message:

```
🎉 Peer Sphere v1.0.0 is now available!

Download the Android app:
https://github.com/Himanshuyadav23/Peer-sphere/releases/latest

Features:
✅ Communities
✅ Events
✅ Messaging
✅ Matchmaking
✅ And more!

For SCSIT DAVV students only.
```

Share through:
- WhatsApp groups
- College email
- Social media
- College website
- Friend circles

---

## 🎬 What's the Full Process?

```
1. eas login              ← Login to your Expo account (2 min)
2. eas build:configure    ← Configure EAS (1 min)
3. eas build              ← Build APK (15-30 min)
4. Download APK           ← Get the file (2 min)
5. Upload to GitHub       ← Create release (5 min)
6. Share link!            ← Tell the world (instant)
```

**Total Time: ~45 minutes**  
**Total Cost: $0** 🎊

---

## 🔍 Check Your Release

After publishing, visit:
```
https://github.com/Himanshuyadav23/Peer-sphere/releases
```

You should see:
- ✅ Your release v1.0.0
- ✅ Release notes
- ✅ APK download link
- ✅ Download count (if available)

---

## ⚠️ Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "You don't have an Expo account"
Go to [expo.dev](https://expo.dev) and sign up for FREE!

### "Build failed"
Check:
- Firebase configuration is correct
- All dependencies are in package.json
- Internet connection is stable
- Check build logs at expo.dev/builds

### "Can't download APK"
- Make sure build completed successfully
- Try the download link from Expo dashboard
- Check build logs for errors

### "Git tag not showing"
```bash
git push origin v1.0.0
```

---

## 📊 Future Releases

When you want to update:

1. Update version in `app.json`:
```json
"version": "1.0.1"
```

2. Tag new version:
```bash
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1 -m "Update with bug fixes"
git push origin v1.0.1
```

3. Build and upload:
- Build new APK
- Create new release on GitHub
- Upload new APK
- Add changelog

---

## 📚 Need More Help?

- 📘 Full guide: [GITHUB_RELEASES_GUIDE.md](./GITHUB_RELEASES_GUIDE.md)
- 🚀 Quick start: [GET_LIVE_NOW.md](./GET_LIVE_NOW.md)
- 🆓 Free options: [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md)
- 💰 Paid options: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

## ✅ Checklist

Before you start:
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Expo account created
- [ ] Git tag created and pushed
- [ ] Ready to spend ~45 minutes

During setup:
- [ ] Logged in to EAS
- [ ] Configured EAS build
- [ ] Started build
- [ ] Built completed successfully
- [ ] APK downloaded

Creating release:
- [ ] Went to GitHub releases page
- [ ] Selected tag v1.0.0
- [ ] Added release notes
- [ ] Uploaded APK
- [ ] Published release
- [ ] Shared with community

---

**Ready to start? Let's make Peer Sphere live! 🚀**

