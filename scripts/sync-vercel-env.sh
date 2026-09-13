#!/usr/bin/env bash
# Idempotent Vercel project environment-variable sync.
#
# Upserts ONE key into ONE Vercel project's env store, for one or more
# targets (production/preview/development), via Vercel's REST API
# directly (no CLI involved, no interactive prompts). Safe to re-run:
# GETs the project's current env vars first, and only POSTs when the
# value or target list actually differs — running it twice with the
# same inputs is a no-op on the second run.
#
# Never prints secret values. Logs only key names, targets, and whether
# a write happened. Designed to be called from a GitHub Actions job
# (each secret copied into a job-level `env:` first — reading `secrets`
# directly inside a job/step `if:` is invalid, see ADR-DS-001 / PR #13),
# but has no dependency on GitHub Actions and works from any shell that
# has `curl` and `jq`.
#
# Required environment variables:
#   VERCEL_TOKEN   - Bearer token with write access to the project
#   VERCEL_TEAM_ID - team_... scoping the project (this repo's team)
#   PROJECT_ID     - prj_... target project
#   ENV_KEY        - variable name, e.g. DATABASE_URL
#   ENV_VALUE      - variable value (never echoed)
#   ENV_TARGETS    - comma-separated: production,preview,development
#
# Optional:
#   DRY_RUN=1      - do everything except the actual POST/PATCH
#   ENV_TYPE       - "encrypted" (default) or "sensitive"
#
# Exit codes: 0 = synced or already up to date, 1 = usage/input error,
# 2 = Vercel API rejected the request (auth, validation, etc).

set -euo pipefail

: "${VERCEL_TOKEN:?VERCEL_TOKEN is required}"
: "${VERCEL_TEAM_ID:?VERCEL_TEAM_ID is required}"
: "${PROJECT_ID:?PROJECT_ID is required}"
: "${ENV_KEY:?ENV_KEY is required}"
: "${ENV_VALUE:?ENV_VALUE is required}"
: "${ENV_TARGETS:?ENV_TARGETS is required (comma-separated)}"

ENV_TYPE="${ENV_TYPE:-encrypted}"
API="https://api.vercel.com"
IFS=',' read -r -a TARGETS <<<"$ENV_TARGETS"

for t in "${TARGETS[@]}"; do
  case "$t" in
    production|preview|development) ;;
    *)
      echo "::error::invalid target '$t' — must be production, preview, or development" >&2
      exit 1
      ;;
  esac
done

targets_json=$(printf '%s\n' "${TARGETS[@]}" | jq -R . | jq -sc .)

echo "== ${ENV_KEY} -> project ${PROJECT_ID}, targets: ${ENV_TARGETS} =="

# 1. Read current state (names/targets/ids only — Vercel never returns
#    decrypted values from this endpoint for "encrypted"/"sensitive"
#    vars, so there is nothing secret to accidentally log here).
current="$(curl -sS -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "${API}/v10/projects/${PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}&decrypt=false")"

if echo "$current" | jq -e '.error' >/dev/null 2>&1; then
  echo "::error::failed to read existing env vars for ${PROJECT_ID}: $(echo "$current" | jq -r '.error.message // .error.code')" >&2
  exit 2
fi

existing_id=$(echo "$current" | jq -r --arg k "$ENV_KEY" \
  '[.envs[]? | select(.key==$k)] | sort_by(.target|length) | last.id // empty')
existing_targets=$(echo "$current" | jq -c --arg k "$ENV_KEY" \
  '[.envs[]? | select(.key==$k)] | map(.target) | flatten | sort | unique')
desired_targets=$(echo "$targets_json" | jq -c 'sort')

if [ -n "$existing_id" ] && [ "$existing_targets" = "$desired_targets" ]; then
  echo "already up to date (id=${existing_id}, targets unchanged) — no write needed."
  exit 0
fi

if [ -n "$existing_id" ]; then
  echo "existing value found (id=${existing_id}, targets=${existing_targets}) — will overwrite via upsert."
else
  echo "no existing value — will create."
fi

if [ "${DRY_RUN:-0}" = "1" ]; then
  echo "DRY_RUN=1 — skipping the actual write."
  exit 0
fi

# 2. Upsert. `upsert=true` on this endpoint replaces-or-creates in one
#    call, so this is safe to run repeatedly without a separate
#    "does it exist?" branch for the write itself (the read above is
#    only for the human-readable log line, not for correctness).
body=$(jq -n \
  --arg key "$ENV_KEY" \
  --arg value "$ENV_VALUE" \
  --arg type "$ENV_TYPE" \
  --argjson target "$targets_json" \
  '{key:$key, value:$value, type:$type, target:$target}')

resp=$(curl -sS -X POST \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  "${API}/v10/projects/${PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}&upsert=true" \
  -d "$body")

if echo "$resp" | jq -e '.error' >/dev/null 2>&1; then
  echo "::error::Vercel rejected the write for ${ENV_KEY} on ${PROJECT_ID}: $(echo "$resp" | jq -r '.error.message // .error.code')" >&2
  exit 2
fi

echo "synced ${ENV_KEY} on ${PROJECT_ID} (targets: ${ENV_TARGETS})."
