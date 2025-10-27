# Deploy PeerSphere to Vercel

## Quick Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Himanshuyadav23/Peer-sphere)

## Manual Deployment Steps

### Option 1: Using Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from your project directory:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (select your account)
   - Link to existing project? **No**
   - Project name: **peer-sphere** (or your preferred name)
   - Directory: **./** (press Enter)
   - Override settings? **No**

5. After deployment, you'll get a URL like: `https://peer-sphere.vercel.app`

### Option 2: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `Himanshuyadav23/Peer-sphere`
4. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Add Environment Variables (if needed):
   - Click **"Environment Variables"** tab
   - The Firebase config is already in the code, but you can add custom ones if needed
6. Click **"Deploy"**
7. Wait for deployment to complete (usually 2-3 minutes)

## Post-Deployment Steps

1. **Access Your Live Site:**
   - Vercel will provide you with a URL like: `https://peer-sphere.vercel.app`
   - You can also add a custom domain if you have one

2. **Set up Demo Users:**
   - Follow the instructions in `DEMO_USERS.md` to create demo users
   - Or let users register through the app

3. **Share with Friends:**
   - Share the Vercel URL with your friends
   - They can register and start using the app immediately

## Environment Variables (Optional)

If you want to use different Firebase config for production, add these in Vercel dashboard:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow the DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys on every push to your main branch!

- Push to `main` → Automatic deployment
- Push to other branches → Preview deployment
- Merge Pull Request → Deploy to production

## Monitoring

- View deployment logs in Vercel dashboard
- Check analytics and performance metrics
- Set up monitoring and alerts

## Troubleshooting

If deployment fails:
1. Check the build logs in Vercel dashboard
2. Make sure all dependencies are in `package.json`
3. Ensure build command works locally: `npm run build`
4. Check that Firebase credentials are accessible

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
