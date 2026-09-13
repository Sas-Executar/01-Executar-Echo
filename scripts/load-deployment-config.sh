#!/usr/bin/env bash
# Non-secret deployment identity. Credentials remain in the runner environment.
set -euo pipefail

config=config/deployment.json
mode=${1:?Expected web, mobile or sync}
missing=()
emit_env() { printf '%s=%s\n' "$1" "$2" >> "${GITHUB_ENV:?}"; }
require_secret() { [ -n "${!1:-}" ] || missing+=("$1"); }

case "$mode" in
  web|sync)
    org=$(jq -er '.vercel.orgId | select(test("^team_[A-Za-z0-9]+$"))' "$config")
    emit_env VERCEL_ORG_ID "$org"
    emit_env VERCEL_TEAM_ID "$org"
    for app in app web api; do
      project=$(jq -er --arg app "$app" '.vercel.projects[$app] | select(test("^prj_[A-Za-z0-9]+$"))' "$config")
      emit_env "VERCEL_PROJECT_ID_${app^^}" "$project"
      if [ "${DEPLOY_APP:-}" = "$app" ]; then
        emit_env VERCEL_PROJECT_ID "$project"
        emit_env PROJECT_ID "$project"
      fi
    done
    require_secret VERCEL_TOKEN
    if [ "$mode" = web ]; then require_secret DATABASE_URL; fi
    if [ "$mode" = sync ]; then
      if [ -z "${DATABASE_URL_VALUE:-}${RESEND_TOKEN_VALUE:-}${CLERK_WEBHOOK_SECRET_VALUE:-}" ]; then
        missing+=("at least one application secret to synchronize")
      fi
      if [ -n "${RESEND_TOKEN_VALUE:-}${RESEND_FROM_VALUE:-}" ]; then
        require_secret RESEND_TOKEN_VALUE
        require_secret RESEND_FROM_VALUE
      fi
    fi
    ;;
  mobile)
    app_config=$(jq -er '.mobile.appConfig' "$config")
    project=$(jq -r '.expo.extra.eas.projectId // ""' "$app_config")
    if ! [[ "$project" =~ ^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$ ]]; then
      missing+=("$app_config: expo.extra.eas.projectId")
    fi
    if [ "${MOBILE_ACTION:-update}" = update ]; then
      update_url=$(jq -r '.expo.updates.url // ""' "$app_config")
      if [ -z "$project" ] || [ "$update_url" != "https://u.expo.dev/$project" ]; then
        missing+=("$app_config: expo.updates.url")
      fi
      if ! jq -e '.expo.runtimeVersion | (type == "string" and length > 0) or (type == "object" and (.policy | type == "string" and length > 0))' "$app_config" >/dev/null; then
        missing+=("$app_config: expo.runtimeVersion")
      fi
    fi
    for field in updateBranch buildProfile; do
      value=$(jq -er --arg field "$field" '.mobile[$field] | select(test("^[A-Za-z0-9_-]+$"))' "$config")
      if [ "$field" = updateBranch ]; then emit_env EAS_UPDATE_BRANCH "$value";
      else emit_env EAS_BUILD_PROFILE "$value"; fi
    done
    require_secret EXPO_TOKEN
    ;;
  *) echo '::error::Expected web, mobile or sync'; exit 1 ;;
esac

if [ "${#missing[@]}" -gt 0 ]; then
  printf 'ready=false\n' >> "${GITHUB_OUTPUT:?}"
  printf 'BLOCKED: %s\n' "${missing[*]}" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
  if [ "${GITHUB_EVENT_NAME:-workflow_dispatch}" = push ]; then
    printf '::warning::Automatic deployment not executed. Missing: %s\n' "${missing[*]}"
    exit 0
  fi
  printf '::error::Deployment blocked. Missing: %s\n' "${missing[*]}"
  exit 1
fi
printf 'ready=true\n' >> "${GITHUB_OUTPUT:?}"
