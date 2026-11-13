# Publishing SanatanVerse on `sanatanverse.cloud` (Trial & Demo Guide)

This workspace is pre-configured to deploy immediately to **`sanatanverse.cloud`** using either **Firebase Hosting** (free tier static CDN + free SSL) or **Google Cloud Run** (full-stack Node/Express + Vite build).

---

## Option 1: Free Trial Hosting via Firebase Hosting (Recommended for Demo)

The files `firebase.json` and `.firebaserc` are pre-wired to your Firebase project **`pristine-music-b3kqt`** and Firestore database **`ai-studio-sanatanverse-b293a80a-66c1-4646-90c3-ac9760cd0661`**.

1. **Build the production bundle:**
   ```bash
   npm install
   npm run build
   ```
2. **Sign in to Firebase CLI & deploy:**
   ```bash
   npx firebase login
   npx firebase deploy --only hosting
   ```
3. **Connect `sanatanverse.cloud` in Firebase Console:**
   - Open [Firebase Hosting for pristine-music-b3kqt](https://console.firebase.google.com/project/pristine-music-b3kqt/hosting/sites)
   - Click **Add custom domain** → enter `sanatanverse.cloud` (and optionally `www.sanatanverse.cloud`).
   - Add the **TXT verification** and **A DNS records** shown by Firebase inside your domain registrar (GoDaddy, Namecheap, Cloudflare, Hostinger, etc.).
   - *(Tip: If using Cloudflare DNS for a quick trial, set proxy status to **DNS Only / grey cloud** while SSL provisioning completes.)*

---

## Option 2: Full-Stack Hosting via Google Cloud Run (Includes `/api/*` Server Routes)

If you prefer running the Express server (`server.ts`, including `/api/feedback` and `/api/oracle/ask`):

1. Deploy from AI Studio (**Deploy / Publish to Cloud Run**) or run `npm run build && npm start` (`NODE_ENV=production tsx server.ts`).
2. In **Google Cloud Console → Cloud Run → Domain Mappings**, map `sanatanverse.cloud` to your Cloud Run service and add the `A` / `AAAA` or `CNAME` records at your DNS provider.

---

## Required Final Step: Authorize `sanatanverse.cloud` for Google Sign-In

Before testing **Studio Sign In** or **Admin (`+ Add Topic`)** on your custom domain:

1. Open [Firebase Authentication Settings](https://console.firebase.google.com/project/pristine-music-b3kqt/authentication/settings).
2. Under **Authorized domains → Add domain**, add:
   - `sanatanverse.cloud`
   - `www.sanatanverse.cloud`
3. Verify `rajsindhav77@gmail.com` signs in smoothly via Google Sign-In and sees the **+ Add Topic** admin control.
