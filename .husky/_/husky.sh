#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. && pwd)"
HUSKY_DIR="$ROOT_DIR/.husky"

echo "→ Ensuring Husky is installed…"
npm install -D husky >/dev/null

echo "→ Enabling Husky via npm prepare script…"
# Works on npm v7+
npm set-script prepare "husky" >/dev/null || true

echo "→ Initializing Husky directory…"
mkdir -p "$HUSKY_DIR"
npx husky install "$HUSKY_DIR"

echo "→ Linking provided hooks (won't overwrite)…"
for hook in pre-commit commit-msg; do
  src="$ROOT_DIR/.husky/$hook"
  dst="$HUSKY_DIR/$hook"
  if [[ -f "$src" ]]; then
    chmod +x "$src"
    echo "   ✓ $hook ready"
  else
    echo "   • $hook not found at $src — create it first (see repo files)"
  fi
done

echo "✔ Done. Try a test commit to verify hooks."
