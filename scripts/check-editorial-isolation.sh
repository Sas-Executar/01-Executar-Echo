#!/usr/bin/env bash
#
# ADR-DS-002 — the boundary guard between the two design systems.
#
# apps/web now carries a second visual identity (@repo/editorial-tokens,
# EXECUTAR Native Editorial v2, ADR-DS-004) alongside the product Design
# System (@repo/design-tokens, ADR-DS-001). They coexist safely only
# because the editorial set is scoped to [data-surface="editorial"] and
# the product set is never edited to accommodate it.
#
# That arrangement is easy to break by accident and expensive to notice:
# the symptom is apps/app or apps/mobile quietly changing colour. This
# script makes the breakage loud and immediate instead.
#
# Run: bash scripts/check-editorial-isolation.sh
set -euo pipefail

fail=0
note() { printf '  - %s\n' "$1" >&2; fail=1; }

printf 'Checking editorial/product design-system isolation (ADR-DS-002)\n'

# 1. The product apps must not consume editorial tokens at all. apps/mobile
#    is React Native and has no CSS custom properties; apps/app is the
#    authenticated product surface and keeps the Green/Azure identity.
for app in apps/app apps/mobile; do
  if [ -d "$app" ] && grep -rlq --exclude-dir=node_modules --exclude-dir=.next \
      -e '@repo/editorial-tokens' -e '--ed-' -e 'data-surface="editorial"' "$app"; then
    note "$app references the editorial token set — it must stay on @repo/design-tokens."
    grep -rn --exclude-dir=node_modules --exclude-dir=.next \
      -e '@repo/editorial-tokens' -e '--ed-' -e 'data-surface="editorial"' "$app" >&2 || true
  fi
done

# 2. The editorial stylesheet must not reach outside its scope. This is the
#    same assertion the drift script makes; repeated here so the guard
#    still holds if that script is ever skipped.
if [ -f packages/editorial-tokens/css/editorial.css ]; then
  if perl -0pe 's{/\*.*?\*/}{}gs' packages/editorial-tokens/css/editorial.css \
      | grep -Eq '(^|\})\s*:root\s*\{'; then
    note 'packages/editorial-tokens/css/editorial.css emits rules at :root.'
  fi
fi

# 3. The product token package is frozen with respect to this work. Editing
#    it to make a public page look right is precisely the failure mode
#    ADR-DS-002 exists to prevent, so changes here have to be deliberate:
#    update PRODUCT_DS_BASELINE.sha256 in the same commit, with an ADR.
baseline='scripts/PRODUCT_DS_BASELINE.sha256'
if [ -f "$baseline" ]; then
  if ! sha256sum --quiet --check "$baseline" 2>/dev/null; then
    note 'The product design system changed (packages/design-tokens or design-system/styles/globals.css).'
    note 'If that is intended, refresh scripts/PRODUCT_DS_BASELINE.sha256 and cite an ADR in the same commit.'
    sha256sum --check "$baseline" 2>&1 | grep -v ': OK$' >&2 || true
  fi
fi

if [ "$fail" -ne 0 ]; then
  printf 'Editorial isolation check FAILED.\n' >&2
  exit 1
fi

printf 'Editorial isolation OK — product design system untouched, editorial tokens contained.\n'
