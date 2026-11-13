#!/usr/bin/env bash
set -euo pipefail

# One-command GitHub setup for SanatanVerse using GitHub CLI (`gh`).
# Usage:
#   gh auth login
#   bash scripts/bootstrap-github.sh <github-username-or-org>/sanatanverse [private|public]

REPO_SLUG="${1:-}"
VISIBILITY="${2:-private}"

if [ -z "$REPO_SLUG" ]; then
  echo "Usage: bash scripts/bootstrap-github.sh <github-username>/sanatanverse [private|public]"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is not installed. Install it from https://cli.github.com/ and run 'gh auth login' first."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Please authenticate GitHub CLI first: gh auth login"
  exit 1
fi

# Initialize Git if downloaded from ZIP rather than cloned
if [ ! -d ".git" ]; then
  git init -b main
  git add -A
  git commit -m "chore: initialize SanatanVerse MVP, Comics Studio, Firebase Hosting & GitHub tracking"
fi

echo "1/4 Creating GitHub repository '$REPO_SLUG' ($VISIBILITY) and pushing 'main'..."
if gh repo view "$REPO_SLUG" >/dev/null 2>&1; then
  echo "Repository '$REPO_SLUG' already exists — configuring remote 'origin' and pushing..."
  git remote remove origin >/dev/null 2>&1 || true
  git remote add origin "https://github.com/${REPO_SLUG}.git"
  git push -u origin main
else
  gh repo create "$REPO_SLUG" "--${VISIBILITY}" --source=. --remote=origin --push
fi

echo "2/4 Creating tracking labels..."
create_label() {
  gh label create "$1" --repo "$REPO_SLUG" --color "$2" --description "$3" --force >/dev/null
}

create_label "track:sacred" "d97706" "Sacred chronology, Puranic & Vedic perspectives"
create_label "track:scientific" "0284c7" "Scientific cosmology, astrophysics & archaeology data"
create_label "track:historical" "059669" "Historical inscriptions, material strata & epigraphy"
create_label "area:comics" "f59e0b" "Comics, motion comics, graphic novels & storyboards"
create_label "area:timeline" "a855f7" "Parallel timeline grid & Era 01-10 topic management"
create_label "area:glossary" "eab308" "Persistent Sanskrit glossary terms & hover parser"
create_label "area:firebase" "ea580c" "Firestore schema, security rules & authentication"
create_label "area:correction" "ec4899" "Scholarly corrections, citations & evidence labels"
create_label "area:ui" "64748b" "Frontend design, accessibility & responsive layout"
create_label "priority:P0" "dc2626" "Critical launch blocker"
create_label "priority:P1" "f97316" "High priority next sprint"
create_label "priority:P2" "3b82f6" "Planned roadmap item"

echo "3/4 Creating milestones..."
gh api -X POST "repos/${REPO_SLUG}/milestones" -f title="v0.1 — Trial Launch (sanatanverse.cloud)" -f description="DNS setup, Firebase Auth authorized domain, Hosting deploy, and baseline 30 topics + 33 comics/media" >/dev/null || true
gh api -X POST "repos/${REPO_SLUG}/milestones" -f title="v0.2 — Comics & Media Production Slate" -f description="Expand multi-panel comic scripts, concept plates, and audio across Eras 01-10" >/dev/null || true
gh api -X POST "repos/${REPO_SLUG}/milestones" -f title="v0.3 — Scholarly Moderation & Community" -f description="Firestore-backed event corrections workflow and community artist showcase" >/dev/null || true
gh api -X POST "repos/${REPO_SLUG}/milestones" -f title="v1.0 — SanatanVerse Studios Streaming Pilot" -f description="Motion comic playback, audio narration tracks, and waitlist launch" >/dev/null || true

echo "4/4 Creating initial tracking issues..."
gh issue create --repo "$REPO_SLUG" \
  --title "[Launch] Connect sanatanverse.cloud DNS & authorize domain in Firebase Auth" \
  --milestone "v0.1 — Trial Launch (sanatanverse.cloud)" \
  --label "area:firebase,priority:P0" \
  --body "Follow DEPLOY_DOMAIN.md to deploy Firebase Hosting for project pristine-music-b3kqt, attach sanatanverse.cloud DNS records, and add sanatanverse.cloud + www.sanatanverse.cloud under Firebase Authentication -> Settings -> Authorized domains." >/dev/null || true

gh issue create --repo "$REPO_SLUG" \
  --title "[Comic/Media] Expand 6-12 panel storyboards for Era 01 (Nasadiya Sukta) & Era 06 (Kurukshetra)" \
  --milestone "v0.2 — Comics & Media Production Slate" \
  --label "area:comics,track:sacred,priority:P1" \
  --body "Draft full dialogue, narration, and artwork direction for Pilot Issue #01 across Sacred, Scientific, and Historical parallel views." >/dev/null || true

gh issue create --repo "$REPO_SLUG" \
  --title "[Community] Persist event correction submissions to Firestore with admin review queue" \
  --milestone "v0.3 — Scholarly Moderation & Community" \
  --label "area:correction,area:firebase,priority:P2" \
  --body "Upgrade EventDetailPage scholarly correction submissions from local/in-memory storage to a moderated Firestore collection with strict rules." >/dev/null || true

echo "Done! View your repository at https://github.com/${REPO_SLUG}"
