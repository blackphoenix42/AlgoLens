#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

echo "→ Ensuring Husky is installed and prepare script set…"
npm pkg set scripts.prepare="husky" >/dev/null
npm i -D husky >/dev/null

echo "→ Initializing Husky (v9)"
# creates .husky/ if missing; safe to re-run
npx husky init >/dev/null

echo "→ Writing hooks (idempotent)…"

write_hook () {
  local path="$1"
  local content="$2"
  if [ ! -f "$path" ] || ! grep -q "## ALGO-LENS HOOK" "$path"; then
    printf "%s\n" "$content" > "$path"
    chmod +x "$path"
    echo "   ✓ $path"
  else
    echo "   • $path already managed"
  fi
}

# pre-commit
read -r -d '' PRE_COMMIT <<'SH'
#!/bin/sh
## ALGO-LENS HOOK
set -e
if command -v npx >/dev/null 2>&1 && npx --no-install lint-staged --version >/dev/null 2>&1; then
  npx --no-install lint-staged
else
  STAGED_NUL=$(git diff --cached --name-only --diff-filter=ACMR -z)
  if [ -n "$STAGED_NUL" ]; then
    if npx --no-install prettier --version >/dev/null 2>&1; then
      printf "%s" "$STAGED_NUL" | xargs -0 npx --no-install prettier --write --log-level warn || true
      git add -A
    fi
    if npx --no-install eslint --version >/dev/null 2>&1; then
      FILES_JS_TS=$(printf "%s" "$STAGED_NUL" | tr '\0' '\n' | grep -E '\.(ts|tsx|js|jsx)$' || true)
      if [ -n "$FILES_JS_TS" ]; then
        echo "$FILES_JS_TS" | xargs npx --no-install eslint --fix --max-warnings=0
        git add $FILES_JS_TS || true
      fi
    fi
  fi
fi
SH

# commit-msg
read -r -d '' COMMIT_MSG <<'SH'
#!/bin/sh
## ALGO-LENS HOOK
set -e
MSG_FILE="$1"
if grep -qiE '^(Merge|Revert|Release|chore\(release\))' "$MSG_FILE"; then
  exit 0
fi
if command -v npx >/dev/null 2>&1 && npx --no-install commitlint --help >/dev/null 2>&1; then
  npx --no-install commitlint --edit "$MSG_FILE"
  exit $?
fi
if ! grep -qE '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9\-.,/]+\))?: .+' "$MSG_FILE"; then
  echo "⛔ Commit message must follow Conventional Commits"
  exit 1
fi
SH

# pre-push
read -r -d '' PRE_PUSH <<'SH'
#!/bin/sh
## ALGO-LENS HOOK
set -e
: "${SKIP_PREPUSH_BUILD:=0}"
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

npm run -s typecheck

if npm run -s lint >/dev/null 2>&1; then
  npm run -s lint
fi

if npm run -s test >/dev/null 2>&1; then
  npm run -s test
fi

if [ "$SKIP_PREPUSH_BUILD" -eq 0 ] && npm run -s build >/dev/null 2>&1; then
  npm run -s build
fi
SH

write_hook ".husky/pre-commit" "$PRE_COMMIT"
write_hook ".husky/commit-msg" "$COMMIT_MSG"
write_hook ".husky/pre-push" "$PRE_PUSH"

echo "✔ Husky ready. Try a test commit/push."
