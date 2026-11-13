# SanatanVerse

> Interactive tri-perspective chronology (**Sacred · Scientific · Historical**), Persistent Sanskrit Glossary, and Comics & Multimedia Studio exploring Sanatan Dharma from cosmic origins to the modern era.

Live Trial Target: **[`https://sanatanverse.cloud`](https://sanatanverse.cloud)**

---

## Key Features

1. **Three Parallel Timeline Tracks (`Sacred`, `Scientific`, `Historical`)**
   - Browse all 3 perspectives side-by-side across 10 chronological eras (`Cosmic Origins` to `Contemporary & Digital Dharma`) or switch to a single focused track.
   - Search and filter across eras, evidence labels (`Well established`, `Estimated date`, `Traditional chronology`, `Textual evidence`, `Debated`, `Unverified claim`), people, texts, places, and citations.
2. **Event Detail Pages & Scholarly Transparency**
   - Displays data type classification, primary vs. historical/scientific date layers, uncertainty notes, primary bibliography, related entity filtering, and correction/feedback submission.
3. **Persistent Hover-Over Sanskrit Glossary**
   - Automatically identifies and highlights 60 Sanskrit terms & scriptural concepts inline across event summaries and explanations with hover/click definitions and a persistent bottom-right dock.
4. **Comics & Media Studio Across All 3 Timelines**
   - Browse the unified **Comics Hub** or open **`Comics & Media (N)`** on any topic across all 3 tracks.
   - Supports attaching **multiple** comics and media items (`Comic Issue`, `Motion Comic`, `Graphic Novel`, `Concept Art`, `Audio Narration`, `Video Teaser`, `Research Sourcebook`) per topic with an interactive Storyboard Panel Reader.
5. **Firebase Auth & Admin-Only Topic Creation**
   - Backed by Cloud Firestore (`pristine-music-b3kqt` / database `ai-studio-sanatanverse-b293a80a-66c1-4646-90c3-ac9760cd0661`) and strict `firestore.rules`.
   - Creating new timeline topics (`/topics`) is restricted to verified administrators; verified signed-in creators can contribute comics and media (`/topicMedia`).

---

## Development & Verification Commands

```bash
npm install               # Install dependencies
npm run dev               # Start Vite + Express dev server on http://localhost:3000
npm test                  # Run all 26 unit tests (timeline, glossary, comic studio logic)
npm run lint              # Run TypeScript check (tsc --noEmit)
npx eslint firestore.rules # Audit Firestore security rules
npm run build             # Build production assets into dist/
npm start                 # Serve compiled dist/ bundle via Express (NODE_ENV=production)
```

---

## Project Planning & Deployment

- **GitHub Planning, Milestones & Workflows**: See [`GITHUB_ROADMAP.md`](./GITHUB_ROADMAP.md)
- **Custom Domain Publishing (`sanatanverse.cloud`)**: See [`DEPLOY_DOMAIN.md`](./DEPLOY_DOMAIN.md)
- **Database Schema & Security Spec**: See [`firebase-blueprint.json`](./firebase-blueprint.json) and [`security_spec.md`](./security_spec.md)

---

## License
Apache-2.0
