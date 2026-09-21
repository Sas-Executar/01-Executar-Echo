# MASTER WORKBOOK — EXECUTAR on next-forge

**Audience: AI agents (Claude Code or equivalent) picking up this repository.**
Read this file first, in full, before touching code or infrastructure. It is
the single entry point that indexes and reconciles every other document in
this repo — it does not replace them, it tells you which one is authoritative
for what, and in what order to read them.

Format convention used throughout: `STATUS` tags are one of
`DONE_VERIFIED`, `IMPLEMENTED_UNVERIFIED`, `EXTERNAL_DEPENDENCY`,
`BLOCKED`, `DRIFT`, `NOT_STARTED` — never treat prose alone as evidence;
a status is only `DONE_VERIFIED` when the evidence line next to it names
something checkable (a commit SHA, a live API response, a build log).

---

## 0. Repository identity

- **Repo**: `Sas-Executar/01-Executar-Echo` (originally created as
  `Sas-Executar/next-forge`, then renamed — GitHub redirects the old URL;
  some older docs in this repo still say `next-forge`, that's the same repo).
- **Upstream template**: [next-forge](https://github.com/vercel/next-forge)
  v6.0.2, a production-grade Turborepo/Next.js SaaS starter.
- **Actual product built on top of it**: **EXECUTAR** — a Portuguese-language
  (pt-BR) execution/productivity copilot SaaS: AI copilot chat, a
  deterministic task/routine engine, a visual scanner (camera → symbol
  recognition → task actions), omnichannel integrations (WhatsApp/Gmail/
  Outlook), and a mobile app (Expo).
- **Requirements source of truth (read-only from here)**:
  `Sas-Executar/Executar-app-Blueprint` — PRDs, ADRs, specs. This repo cites
  Blueprint IDs (`PRD-*`, `ADR-*`, `SPEC-*`, `REQ-*`) but never edits that
  repo as part of product work here. See `AGENTS.md` for the full
  precedence rule when something isn't decided yet. Exception: the Blog
  domain's canonical requirements source is `Sas-Executar/LANCAMENTO`
  (`DEC-006`, `DECISION_LOG.md`), also read-only from here.

## 1. Reading order — which doc answers which question

| Question | Read |
|---|---|
| "What's the architecture/stack convention, what can I change vs. must ask first?" | `AGENTS.md` |
| "Is this repo's code actually finished — what's real vs. claimed?" | `PRODUCT_AUDIT.md` |
| "What CI gates exist, what are their thresholds, why?" | `QUALITY_GATES.md` |
| "What infra/deploy config exists, what's dashboard-only?" | `INFRASTRUCTURE.md` |
| "What accounts/credentials/env vars does launch need, what's done?" | `LAUNCH_RUNBOOK.md` |
| "What's the step-by-step launch workflow and its live status?" | `WORKFLOW_01_01_RUNBOOK.md` (spec) + `WORKFLOW_01_01_EXECUTION_LOG.md` (raw findings log) |
| "What did the previous session already do, what's mid-flight?" | `HANDOFF.md` (may be stale — cross-check against git log and this file's §4 before trusting it) |
| "What's the next single task, right now?" | This file, §4 |
| "What is this repo, at a glance, for a human?" | `README.md` |

**Precedence when two docs disagree**: live evidence (a real API response, a
real build log, `git log`) always wins over any document, including this
one. Among documents, the most recently dated entry in
`WORKFLOW_01_01_EXECUTION_LOG.md` wins over `LAUNCH_RUNBOOK.md`, which wins
over `HANDOFF.md` (oldest, written 2026-09-11, before most of what's below
happened).

## 2. System map (verified state, not assumption)

| Layer | State | Evidence |
|---|---|---|
| Product code | Complete for M00–M21 scope: 28 Prisma models w/ RLS, `apps/mobile` (Expo), visual scanner (DINOv2/ONNX), routines/automations, copilot (agent-runtime on Vercel AI SDK), Stripe billing, 4 omnichannel integrations, MCP server, 23+ authenticated routes | `PRODUCT_AUDIT.md`; merged to `main` via PR #1 |
| CI | `ci.yml` green: typecheck 38/38, lint (`ultracite check`) 0 issues, tests passing (DB-gated suites skip without `DATABASE_URL`) | `.github/workflows/ci.yml`; `QUALITY_GATES.md` |
| Vercel projects | 4 projects exist and are correctly linked to this repo (`executar-nf-{app,web,api,storybook}`) under team `Sas_Executar` (`team_fJe21quDM0egDSTPE0CFwNnm`) | `mcp__Vercel__list_projects` output, this session |
| Vercel builds on `main` | `storybook` = READY. `app`/`web`/`api` — 4 real code bugs found and fixed (PR #12, merged as `31770ff`); a live redeploy on `main` post-merge still needs reconfirming (see §4) | Real build logs pulled via `mcp__Vercel__get_deployment_build_logs`, this session |
| Vercel env vars | `DATABASE_URL` present on `app`/`api` for Production only (Preview builds fail); `NEXT_PUBLIC_APP_URL` **absent entirely** on `web` (confirmed via `vercel env ls`, not assumed) | This session, `vercel env ls` output against a real `VERCEL_TOKEN` |
| Neon (database) | Real: project `executar-production` (`snowy-dawn-65785764`), 30 tables, RLS policies, 8 migrations applied | `LAUNCH_RUNBOOK.md` §1 |
| Stripe | Real, test-mode: 6 products/prices + 1 webhook created | `LAUNCH_RUNBOOK.md` §5 |
| Clerk, OpenAI, BaseHub, Resend, Knock, BetterStack, Arcjet, Svix, Liveblocks, Upstash, Vercel Blob, PostHog, WhatsApp, Gmail OAuth, Outlook OAuth, Expo/EAS, Apple Developer, Google Play, custom domain | Not provisioned — no connector exists for most; dashboard/account work only a human can do | `LAUNCH_RUNBOOK.md` §3–9 |

## 3. Outcomes this repo is driving toward (O-001…O-010)

| ID | Outcome |
|---|---|
| O-001 | User opens `apps/web`, understands EXECUTAR's value prop, sees real pricing |
| O-002 | User creates an account/organization via Clerk (production instance) |
| O-003 | User completes onboarding, gets a first proposed backlog/routine |
| O-004 | User subscribes via Stripe checkout (livemode) |
| O-005 | Payment grants a real entitlement (webhook → database) |
| O-006 | Core loop works end-to-end: Copilot → Routines → Mapa-OS → Report |
| O-007 | Omnichannel integrations (WhatsApp/Gmail/Outlook) and mobile app work with real credentials |
| O-008 | Visual scanner delivers measured value (real device latency, not just unit-tested) |
| O-009 | Business events are observable (real analytics/observability keys) |
| O-010 | User can return, get support, export/delete data (LGPD) |

`FIRST_REAL_USER_SUCCESS` = O-001 through O-006 working end-to-end against
real (not test-mode) infrastructure for one real signed-up, paying user.

## 4. Current gate and next action

**Gate**: `W1.1.2 — Reconcile Vercel projects` (see `WORKFLOW_01_01_RUNBOOK.md`
for the full acceptance criteria). Status: `DRIFT` — code-side work is done
and merged; infra-side env var scope is the only remaining blocker.

**What's already resolved** (do not re-investigate):
- 4 real build-breaking code bugs (PR #12, merged to `main` as `31770ff`):
  `"use server"` files exporting non-async members; `Knock` client built
  eagerly against an optional env var; `import.meta.dirname` unpopulated
  inside Next's Turbopack server bundle (fixed via `import.meta.url` +
  `fileURLToPath`); `apps/api/proxy.ts`'s bare re-export not recognized by
  Next's proxy convention detection.
- Full verification: `turbo typecheck` 38/38, `ultracite check` 653 files/0
  issues, `turbo test` passing for every touched package, real local
  `next build` for all three apps with the runbook's own documented
  required env vars.

**What's still open** (external, dashboard-only — no MCP tool in any
session so far can write Vercel project env vars per-environment):
1. `executar-nf-web` — add `NEXT_PUBLIC_APP_URL` (currently **absent**,
   all environments) and confirm `NEXT_PUBLIC_WEB_URL` covers Preview too.
2. `executar-nf-app` and `executar-nf-api` — confirm `DATABASE_URL`'s
   environment scope includes **Preview**, not just Production.
3. After either fix: trigger a fresh deploy (a Vercel dashboard "Redeploy",
   or any new commit) and re-check `mcp__Vercel__get_project` /
   `get_deployment_build_logs` for a real `READY` state — do not mark this
   gate `DONE_VERIFIED` from the fix alone, only from a live green build.

**Only after this gate closes**, advance to `W1.1.3` (credentialed E2E) per
`WORKFLOW_01_01_RUNBOOK.md`.

## 5. Decisions already made (don't re-litigate without new evidence)

1. **Merge order**: PR #1 (the full product) was the base to merge to
   `main` — done, no longer open.
2. **Agent runtime**: ship with the current Vercel AI SDK-based
   `agent-runtime`; a Claude Agent SDK migration (proposed in a since-doc-only
   PR) is deliberately deferred as post-launch backlog, not a launch gate.
3. **Multi-repo "ecosystem" framing**: this repo is self-sufficient for
   launch. Sibling repos (`Executar-app-Blueprint`, `Maestr-Docs`,
   `Programa-Sas`, `Desyng-System-ecossitema`, `EXECUTAR-Product-Spec`) are
   spec/governance sources already reconciled into this repo's own docs —
   they don't block `FIRST_REAL_USER_SUCCESS`.

If new evidence contradicts any of these, update this section explicitly
rather than silently overriding it.

## 6. External action register (only a human can do these)

Ordered by lead time (longest first — start these early, in parallel,
per the "walk backwards from the outcome" principle):

1. Apple Developer Program + Google Play Console enrollment (identity/payment,
   days–weeks lead time).
2. Stripe livemode business verification (KYC, days).
3. Clerk: switch Development → Production instance + configure org webhook
   (dashboard only, no provisioning API).
4. Domain purchase + DNS (naming decision required; Vercel MCP can execute
   the purchase itself once a domain and budget are approved).
5. Accounts with no connector at all: OpenAI, BaseHub (now closed — see
   below), Resend, Knock, BetterStack, Arcjet, Svix, Liveblocks, Upstash,
   Vercel Blob, PostHog, WhatsApp Cloud API, Gmail OAuth, Outlook OAuth.
6. `eas init` (Expo/EAS) + `EXPO_TOKEN` as a GitHub secret.
7. **Immediate, blocking §4**: Vercel dashboard env var scope fixes above.

Each of these unblocks a specific, named node — see `LAUNCH_RUNBOOK.md` §3–9
for the exact variable names and target files that consume them.

## 7. Operating rules for any agent continuing this work

- **Never assume — verify.** Every status above was produced by an actual
  tool call (a real deployment log, `vercel env ls`, `git log`), not by
  reading a claim in another doc. When a doc and live state disagree,
  live state wins and the doc gets corrected in the same session.
- **Root-cause before reporting a blocker as external.** Every "env var
  missing" claim in this repo's history was confirmed by pulling the real
  Vercel build log first — several apparent "infra gaps" turned out to be
  real code bugs (see §4's 4 fixes). Don't default to "needs credentials"
  without checking the actual error.
- **One WIP task at a time.** Don't fan out into unrelated milestones while
  a gate is open; close §4 before starting `W1.1.3`.
- **Secrets discipline.** Never write a live secret into a commit, PR
  body, or this file. `.env*` and `.vercel/` are gitignored per-app —
  keep it that way. If a secret is ever pasted into a chat/session in
  plaintext, treat it as compromised and get it rotated before using it,
  regardless of stated authorization — a chat transcript is not a secure
  credential store.
- **Auto-mode guardrails are not obstacles to route around.** If a
  write action (secret-store writes, shared-resource modification,
  self-modification of permission config) is denied by the harness, do
  not retry through a different tool to achieve the same effect — surface
  it to the human with the exact command/change needed and let them run
  it, or grant permission from outside the session (e.g. editing
  `.claude/settings.json` via GitHub's web UI, not from inside this
  session).
- **Update the log, not just your memory.** Real findings go into
  `WORKFLOW_01_01_EXECUTION_LOG.md` (append, dated) and this file's §4
  (overwrite with current state) — a future session/agent should never
  have to re-discover something already found once.

## 8. Repo map (for orientation, not exhaustive — see README.md §Structure)

```
apps/
  app/         — authenticated product app (Next.js) — the core EXECUTAR UI
  web/         — public marketing site + blog/legal (Next.js)
  api/         — backend API routes, webhooks, cron, MCP server (Next.js)
  storybook/   — component library
  mobile/      — Expo app
  docs/        — Fumadocs site
  email/       — transactional email templates (react-email)
  studio/      — Prisma Studio wrapper

packages/      — 30 shared packages: database (Prisma+RLS), auth (Clerk),
                 billing (Stripe), agent-runtime (AI SDK copilot), mapa-os
                 (status projections/report generation), scanner (visual
                 recognition), routines, automation, integrations
                 (WhatsApp/Gmail/Outlook), mcp (Model Context Protocol
                 server), observability, security, design-system, and more
                 — one directory per bounded concern, see each package's
                 own README/keys.ts for its env var contract.
```

---

*This file is the canonical AI-agent entry point. Keep §4 current — it is
the first thing a new session should trust for "what do I do right now."*
