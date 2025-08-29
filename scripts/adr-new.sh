#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. && pwd)"
ADR_DIR="$ROOT_DIR/docs/ADR"
TEMPLATE="$ADR_DIR/0000-template.md"

title="${1:-}"
if [[ -z "$title" ]]; then
  echo "Usage: $(basename "$0") \"Title of the decision\"" >&2
  exit 1
fi

mkdir -p "$ADR_DIR"
if [[ ! -f "$TEMPLATE" ]]; then
  cat >"$TEMPLATE" <<'EOF'
# ADR {NUMBER}: {TITLE}

- **Date:** {YYYY-MM-DD}
- **Status:** Proposed
- **Owners:** @owner
- **Tags:** [area]

## Context

## Decision

## Consequences

## Alternatives considered

## References
EOF
fi

# Next number (4 digits)
next_num=$(find "$ADR_DIR" -maxdepth 1 -name '[0-9][0-9][0-9][0-9]-*.md' -printf '%f\n' 2>/dev/null \
  | sort -n | tail -1 | sed -E 's/^([0-9]{4}).*/\1/' | awk '{print ($0+1)}')
[[ -z "$next_num" ]] && next_num=1
printf -v num "%04d" "$next_num"

# Slug
slug="$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
file="$ADR_DIR/${num}-${slug}.md"
date_str="$(date +%F)"

# Render from template
sed -e "s/{NUMBER}/$num/g" -e "s/{TITLE}/$title/g" -e "s/{YYYY-MM-DD}/$date_str/g" "$TEMPLATE" > "$file"

# Update ADR index in README if present
READ="$ADR_DIR/README.md"
if [[ -f "$READ" ]]; then
  # Append a bullet if not already present
  link_rel="${num}: ${title}"
  grep -q "$link_rel" "$READ" || {
    echo "- [${num}: ${title}]($(basename "$file"))" >> "$READ"
  }
fi

echo "✓ Created $file"
