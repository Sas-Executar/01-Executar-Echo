#!/usr/bin/env bash
set -euo pipefail
: "${DEPLOYMENT_URL:?}"
: "${HEALTH_PATH:?}"
# Do not follow redirects: a protected deployment's login page is not health.
status=$(curl --silent --show-error --connect-timeout 10 --max-time 30 \
  --output /dev/null --write-out '%{http_code}' "$DEPLOYMENT_URL$HEALTH_PATH")
if [[ "$status" != 2[0-9][0-9] ]]; then
  echo "::error::Health check failed: HTTP $status for $HEALTH_PATH"
  exit 1
fi
printf 'Health check %s: HTTP %s\n' "$HEALTH_PATH" "$status" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
