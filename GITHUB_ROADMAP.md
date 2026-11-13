# SanatanVerse GitHub Planning & Tracking Guide

Use this structure on GitHub from Day 1 to track every engineering release, timeline topic, comic issue, and domain deployment for **`sanatanverse.cloud`**.

---

## 1. Repository Setup & Initial Push

Git has already been initialized locally on branch `main` with `.gitignore`, CI/CD workflows, and issue templates.

**Fastest Option (1-Command Setup via [GitHub CLI](https://cli.github.com/)):**
After installing `gh` and signing in (`gh auth login`), run this script from the extracted folder to create your GitHub repo, push `main`, and automatically create all 12 labels, 4 milestones, and starter tracking issues:

```bash
bash scripts/bootstrap-github.sh <your-username>/sanatanverse private
```

**Manual Option:** Connect an empty GitHub repository and push:

```bash
git remote add origin https://github.com/<your-username>/sanatanverse.git
git push -u origin main
```

---

## 2. Branching Workflow

| Branch | Purpose | Auto Checks |
| :--- | :--- | :--- |
| **`main`** | Production release synced with `sanatanverse.cloud` | CI tests, TypeScript lint, Firestore rules audit, build + optional Firebase deploy |
| **`dev`** | Active integration branch for upcoming trial/demo features | CI tests, TypeScript lint, Firestore rules audit, build |
| **`feat/<name>`** | New UI features or platform capabilities (branch off `dev`) | Verified on PR into `dev` |
| **`content/<name>`** | Seeded comics, glossary terms, or bibliography updates | Verified on PR into `dev` |

---

## 3. Milestones Roadmap (GitHub → Issues → Milestones)

Create these 4 Milestones in GitHub to track progress from trial launch to full streaming scale:

### Milestone 1: `v0.1 — Trial Launch (sanatanverse.cloud)` *(Current)*
- [x] Core 3-Parallel Timeline (`Sacred`, `Scientific`, `Historical` across Eras 01–10)
- [x] Event Detail Pages with evidence labels, uncertainty notes & source bibliography
- [x] Persistent hover-over Sanskrit Glossary (60 terms + toggleable dock)
- [x] Comics & Media Studio (seeded 33 media editions + multi-comic support per topic)
- [x] Firebase Firestore + Auth integration with Admin-only Topic creation (`rajsindhav77@gmail.com`)
- [x] Hosting configuration (`firebase.json`, `.firebaserc`, `favicon.svg`)
- [ ] Connect `sanatanverse.cloud` DNS & authorize domain in Firebase Auth Console

### Milestone 2: `v0.2 — Comics & Media Production Slate`
- [ ] Complete 6–12 panel storyboards across Era 01 (`Nasadiya Sukta`) and Era 06 (`Kurukshetra`)
- [ ] Add custom high-resolution cover artwork per individual comic issue
- [ ] Track creators & comic drafts per topic using `.github/ISSUE_TEMPLATE/02-comic-or-media-production.yml`

### Milestone 3: `v0.3 — Scholarly Moderation & Community`
- [ ] Persist event correction/feedback submissions to Firestore `/corrections` with Admin moderation queue
- [ ] Add community art gallery showcase linked directly to each topic

### Milestone 4: `v1.0 — SanatanVerse Studios Streaming Pilot`
- [ ] Interactive motion-comic playback with Web Audio / narration tracks
- [ ] Waitlist onboarding and early founder access

---

## 4. Recommended GitHub Project Board & Labels

Create a **GitHub Project (Board view)** with columns:
`Backlog` → `Planned (This Sprint)` → `In Progress` → `In Review` → `Live on sanatanverse.cloud`

Create these **Issue Labels** for filtering:
- **Tracks**: `track:sacred`, `track:scientific`, `track:historical`
- **Areas**: `area:comics`, `area:timeline`, `area:glossary`, `area:firebase`, `area:ui`
- **Priority**: `priority:P0`, `priority:P1`, `priority:P2`

---

## 5. Enabling Auto-Deploy to `sanatanverse.cloud` from GitHub Actions

Once your repo is on GitHub:
1. Run locally: `npx firebase login:ci` (or generate a Firebase Hosting Service Account JSON key for project `pristine-music-b3kqt`).
2. In your GitHub repo → **Settings → Secrets and variables → Actions**, add:
   - Secret name: **`FIREBASE_SERVICE_ACCOUNT`**
3. Every push to `main` will automatically test, lint, build `dist/`, and deploy to Firebase Hosting (`sanatanverse.cloud`).

---

## 6. Free Public Test Link via GitHub Pages (`github.io`)

To publish a free public testing link directly from GitHub (`https://<your-username>.github.io/sanatanverse/`):

1. Ensure the GitHub repository visibility is **`public`** *(free GitHub Pages requires a public repo)*:
   ```bash
   bash scripts/bootstrap-github.sh <your-username>/sanatanverse public
   ```
2. Open your repo on GitHub → **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. The included workflow `.github/workflows/deploy-github-pages.yml` automatically computes the repository subpath (`VITE_BASE_PATH`), builds `dist/`, and publishes your live test URL (`https://<your-username>.github.io/sanatanverse/`).
4. **Optional for Sign-In / Admin Testing on GitHub Pages**: Add `<your-username>.github.io` under [Firebase Authentication → Settings → Authorized domains](https://console.firebase.google.com/project/pristine-music-b3kqt/authentication/settings). *(All public timeline browsing, Sanskrit glossary, and seeded comics work immediately without signing in.)*
