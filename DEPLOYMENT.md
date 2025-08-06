# Deploying AdForge Pro to Render

## Prerequisites
- GitHub account
- Render account (free tier available)

## Step-by-Step Deployment Guide

### 1. Push to GitHub
```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial commit - AdForge Pro"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/Static-Ads-Gen.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Render

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign up/Login to your account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub account
   - Select your repository: `Static-Ads-Gen`

3. **Configure the Service**
   - **Name**: `adforge-pro`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `cd web && npm install && npm run build`
   - **Start Command**: `cd web && npm start`

4. **Environment Variables**
   - Add `NODE_ENV=production`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes)

### 3. Custom Domain (Optional)
- Go to your service settings
- Add custom domain if desired

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check if all dependencies are in `package.json`
2. **Port Issues**: Render automatically handles port assignment
3. **Environment Variables**: Make sure `NODE_ENV=production` is set

### Support:
- Render Documentation: https://render.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

## Your App URL
After deployment, your app will be available at:
`https://adforge-pro.onrender.com` (or your custom domain) 