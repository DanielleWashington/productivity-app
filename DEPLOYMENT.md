# 🚀 Deployment Guide - Quantum Leap

## Pre-Deployment Checklist

✅ All phases complete (v10.0)  
✅ Vercel.json configured  
✅ Files ready:
- index.html (v14 cache)
- onboarding.html (v10.0 appVersion)
- app.js (v14 cache)
- styles.css (v14 cache)
- README-PUBLIC.md
- IMPLEMENTATION.md

---

## 🎯 Quick Deploy to Vercel

### Option 1: Vercel CLI (Fastest)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login**
```bash
vercel login
```
- Opens browser
- Sign in with GitHub/GitLab/Bitbucket/Email

**Step 3: Deploy**
```bash
cd "/Users/daniellewashington/Desktop/goose/productivity app public"
vercel --yes
```

**Step 4: Deploy to Production**
```bash
vercel --prod
```

---

### Option 2: Vercel Web Interface

**Step 1: Create GitHub Repository**
```bash
cd "/Users/daniellewashington/Desktop/goose/productivity app public"
git init
git add .
git commit -m "Initial commit - Quantum Leap v10.0"
```

**Step 2: Push to GitHub**
- Create new repo at github.com
- Follow GitHub's instructions to push

**Step 3: Import to Vercel**
- Go to vercel.com
- Click "New Project"
- Import your GitHub repository
- Click "Deploy"

---

## 📋 Deployment Commands Reference

### First Time Deploy
```bash
# Navigate to project
cd "/Users/daniellewashington/Desktop/goose/productivity app public"

# Login to Vercel (one-time)
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Update Existing Deployment
```bash
# After making changes
vercel --prod
```

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

---

## 🌐 Post-Deployment

### What You'll Get

**Vercel provides:**
- Live URL: `https://your-project-name.vercel.app`
- HTTPS by default
- Global CDN
- Automatic git deployments (if using GitHub)
- Preview deployments for branches

**Share the app:**
1. Copy the Vercel URL
2. Share with anyone
3. They take the quiz
4. They get their personalized app

---

## 🔧 Environment Configuration

### Vercel Project Settings

**Build Settings:**
- Framework Preset: `Other`
- Build Command: (leave empty)
- Output Directory: (leave empty)
- Install Command: (leave empty)

**Root Directory:**
- `.` (current directory)

**Node.js Version:**
- Not needed (static files only)

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain (e.g., `quantumleap.app`)
4. Follow DNS configuration steps
5. Vercel handles SSL automatically

**DNS Settings (example):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 Post-Launch Checklist

After deployment:

- [ ] Test onboarding quiz on live URL
- [ ] Complete quiz and verify redirect to main app
- [ ] Test all 5 screens (Home, Today, Plan, Visibility, Recovery)
- [ ] Test 12-week sprint creation
- [ ] Test visibility action logging with fear/confidence
- [ ] Test reflection saving
- [ ] Test daily completion with calendar sparkles
- [ ] Test on mobile device
- [ ] Test in different browsers
- [ ] Verify localStorage persistence

---

## 🐛 Troubleshooting

### Deployment Fails
**Issue:** `vercel` command not found  
**Fix:** Install CLI: `npm install -g vercel`

**Issue:** Login fails  
**Fix:** Try: `vercel logout` then `vercel login` again

### App Not Loading
**Issue:** Blank screen on deployed URL  
**Fix:** Check browser console, verify index.html loads

**Issue:** Stuck on onboarding  
**Fix:** Version mismatch - verify onboarding.html sets appVersion to '10.0'

### Data Not Persisting
**Issue:** Quiz restarts every time  
**Fix:** Check localStorage is enabled in browser
**Fix:** Verify onboardingComplete flag is set

---

## 🔄 Update Workflow

### Making Changes After Deployment

1. **Edit files locally**
   ```bash
   # Example: Update app.js
   code app.js
   ```

2. **Test locally**
   - Open index.html in browser
   - Verify changes work

3. **Update version numbers**
   - Bump appVersion in index.html
   - Bump appVersion in onboarding.html
   - Update cache versions (?v=XX)

4. **Deploy**
   ```bash
   vercel --prod
   ```

5. **Verify live**
   - Visit live URL
   - Test changes
   - Clear browser cache if needed

---

## 📈 Analytics (Optional)

### Add Vercel Analytics

1. Go to Vercel Dashboard
2. Your Project → Analytics
3. Enable Web Analytics
4. Add snippet to index.html if prompted

### Add Google Analytics (Optional)

Add before `</head>` in index.html and onboarding.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎯 Current Deployment Status

**Version:** v10.0  
**Date:** January 22, 2026  
**Status:** Ready for deployment ✅

**All Phases Complete:**
- ✅ Phase 1: 12-question identity quiz
- ✅ Phase 2: Visibility fear/confidence tracking
- ✅ Phase 3: Principle-based copy refinement
- ✅ Phase 4: Today screen simplification ("One Primary Action")
- ✅ Phase 5: Comprehensive documentation (this file)

---

## 📞 Next Steps

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Share URL** with beta testers

3. **Gather feedback**

4. **Iterate and redeploy** as needed

---

**Ready to launch!** 🚀✨

Run `vercel --prod` from the project directory to deploy.
