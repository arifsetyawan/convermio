#!/usr/bin/env bash
# Publish convermio to npm.
#
# Usage:
#   bash scripts/publish.sh [patch|minor|major|<version>]
#   bash scripts/publish.sh patch --dry-run
#
# Flow:
#   1. Verify prerequisites (clean git tree, correct branch, npm auth).
#   2. Bump version via `npm version` (creates a git tag).
#   3. Run `npm publish` (triggers prepublishOnly: clean + build + test).
#   4. Push commit + tag to origin.

set -euo pipefail

BUMP="${1:-}"
DRY_RUN=0
for arg in "$@"; do
  [[ "$arg" == "--dry-run" ]] && DRY_RUN=1
done

if [[ -z "$BUMP" ]]; then
  echo "usage: $0 [patch|minor|major|<version>] [--dry-run]" >&2
  exit 1
fi

cd "$(dirname "$0")/.."

log()  { printf "\033[1;34m==>\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m!!>\033[0m %s\n" "$*" >&2; }
fail() { printf "\033[1;31mxx>\033[0m %s\n" "$*" >&2; exit 1; }

# --- Preflight -------------------------------------------------------------

log "Checking git working tree is clean..."
if [[ -n "$(git status --porcelain)" ]]; then
  fail "Working tree is dirty. Commit or stash changes before releasing."
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
log "Current branch: $BRANCH"
if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
  warn "You are not on main/master. Current: $BRANCH"
  read -rp "Continue anyway? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || fail "Aborted."
fi

log "Verifying npm authentication..."
NPM_USER="$(npm whoami 2>/dev/null || true)"
if [[ -z "$NPM_USER" ]]; then
  fail "Not logged in to npm. Run: npm login"
fi
log "Logged in as: $NPM_USER"

# --- Version bump ----------------------------------------------------------

CURRENT_VERSION="$(node -p "require('./package.json').version")"
log "Current version: $CURRENT_VERSION"

if [[ $DRY_RUN -eq 1 ]]; then
  log "Dry run: skipping version bump and publish."
  npm run clean
  npm run build
  npm test
  npm publish --dry-run
  log "Dry run complete. No changes pushed."
  exit 0
fi

log "Bumping version ($BUMP)..."
NEW_VERSION="$(npm version "$BUMP" -m "chore(release): %s")"
log "New version: $NEW_VERSION"

# --- Publish ---------------------------------------------------------------

log "Publishing to npm (prepublishOnly will run clean + build + test)..."
if ! npm publish --access public; then
  warn "npm publish failed. Rolling back version bump..."
  git tag -d "$NEW_VERSION" || true
  git reset --hard HEAD~1
  fail "Publish failed. Local version bump rolled back."
fi

# --- Push ------------------------------------------------------------------

log "Pushing commit and tag to origin..."
git push --follow-tags origin "$BRANCH"

log "Released $NEW_VERSION successfully."
