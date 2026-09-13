#!/usr/bin/env bash
# Idempotent upsert by key and target. Always writes the supplied value:
# encrypted metadata cannot prove equality, so target equality is insufficient.
# Required: VERCEL_TOKEN, VERCEL_TEAM_ID, PROJECT_ID, ENV_KEY, ENV_VALUE,
# ENV_TARGETS (comma-separated). Optional: DRY_RUN=1, ENV_TYPE=encrypted.
set -euo pipefail

: "${VERCEL_TOKEN:?VERCEL_TOKEN is required}"
: "${VERCEL_TEAM_ID:?VERCEL_TEAM_ID is required}"
: "${PROJECT_ID:?PROJECT_ID is required}"
: "${ENV_KEY:?ENV_KEY is required}"
: "${ENV_VALUE:?ENV_VALUE is required}"
: "${ENV_TARGETS:?ENV_TARGETS is required}"

ENV_TYPE="${ENV_TYPE:-encrypted}"
IFS=',' read -r -a TARGETS <<<"$ENV_TARGETS"
for target in "${TARGETS[@]}"; do
  case "$target" in
    production|preview|development) ;;
    *) echo '::error::Invalid environment target'; exit 1 ;;
  esac
done
case "$ENV_TYPE" in
  encrypted|sensitive) ;;
  *) echo '::error::ENV_TYPE must be encrypted or sensitive'; exit 1 ;;
esac

if [ "${DRY_RUN:-0}" = 1 ]; then
  echo "DRY_RUN: would upsert $ENV_KEY on $PROJECT_ID ($ENV_TARGETS)"
  exit 0
fi

targets_json=$(printf '%s\n' "${TARGETS[@]}" | jq -R . | jq -sc 'unique')
# jq reads the secret from its environment; request JSON travels over stdin.
# Discard provider response bodies: errors may contain submitted values.
export ENV_KEY ENV_VALUE ENV_TYPE
status=$(jq -n --argjson target "$targets_json" \
  '{key:env.ENV_KEY, value:env.ENV_VALUE, type:env.ENV_TYPE, target:$target}' |
  curl --silent --show-error --connect-timeout 10 --max-time 60 \
    --output /dev/null --write-out '%{http_code}' -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H 'Content-Type: application/json' \
    "https://api.vercel.com/v10/projects/$PROJECT_ID/env?teamId=$VERCEL_TEAM_ID&upsert=true" \
    --data-binary @-)
if [[ "$status" != 2[0-9][0-9] ]]; then
  echo "::error::Vercel env upsert failed: HTTP $status ($ENV_KEY)"
  exit 2
fi
echo "Synced $ENV_KEY on $PROJECT_ID ($ENV_TARGETS)."
