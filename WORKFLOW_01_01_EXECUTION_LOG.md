# WORKFLOW 01.01 — Execution Log

## 2026-09-12 — W1.1.2 Vercel reconciliation

Result: `DRIFT_CONFIRMED`

Connected team:
- `Sas_Executar`
- `team_fJe21quDM0egDSTPE0CFwNnm`

Live project inventory returned by Vercel:
- `executar` — `prj_kS2cMe3GBqgbrchMCmUN3eQyxU4P` — linked to `Sas-Executar/Sas-Executar`
- `payload-website-starter` — `prj_4ky5u6OSsCga7uutpOO0d9W2kZmC` — linked to `Sas-Executar/CustoCognitivoBlog`
- `rc-mapa-interativo` — `prj_unY23X6stsfCvTG7qKHIu6cVCS53`

Documented M21 project IDs checked directly:
- `executar-nf-app` / `prj_MkAbPkEyQRJboeX6xTKiLFoviPdl` → 404 Not Found
- `executar-nf-web` / `prj_h4tfuhTnIiedTObU16xvBAEWkBWI` → 404 Not Found
- `executar-nf-api` / `prj_eT3E4NGlkjWnDhv1XmGCnxi0932M` → 404 Not Found
- `executar-nf-storybook` / `prj_ZaRfOZdchptCOpjViZj4RubN4I4C` → 404 Not Found

Decision:
- `LAUNCH_RUNBOOK.md` §2 cannot currently be treated as `DONE_VERIFIED`.
- Do not continue credentialed E2E against the old documented Vercel URLs until the four `next-forge` projects are restored/recreated/relinked and verified.

Next action:
1. Provision or relink four Vercel projects for `Sas-Executar/next-forge` with root directories:
   - `apps/app`
   - `apps/web`
   - `apps/api`
   - `apps/storybook`
2. Re-establish environment-variable matrix.
3. Deploy the release candidate branch.
4. Verify resulting deployment URLs and GitHub Vercel checks.
5. Only then advance to W1.1.3 and credentialed E2E.

## 2026-09-13 — Full-scope reconciliation (autonomous check-in)

Live-connector reconciliation across GitHub/Vercel/Neon/Stripe/Resend
against `main`'s current head (`31770ff`, PR #12 merged). Evidence-first,
each finding checked against the provider's own live API, not the
repo's own docs. Two code fixes landed as separate draft PRs; everything
else below is either already-real (verified) or genuinely 🧑-only.

**Findings:**

1. **CI has been fully broken on `main` since ADR-DS-001, not just
   flaky.** `ci.yml`'s two most recent runs on `main` (`1e14dbe`,
   `31770ff`) both show `conclusion: failure` with **zero jobs run** —
   confirmed via the run's own error: `Unrecognized named-value:
   'secrets'` at `ci.yml:100`. The `visual-regression` job's job-level
   `if: ${{ secrets.CHROMATIC_PROJECT_TOKEN != '' }}` is invalid — GitHub
   Actions only exposes `secrets` to step-level `if`, not job-level —
   so the whole workflow file fails to parse, silently skipping lint/
   typecheck/test/token-drift on every push. Fixed in PR #13 (moved the
   same gate to each step instead of the job).
2. **`executar-nf-web` production has never once been green.** Every
   `target: production` deployment in its history is `ERROR` — this is
   not a regression, it's the project's permanent state so far. Root
   cause pulled from the real build log (not assumed):
   `NEXT_PUBLIC_WEB_URL` is `undefined` at build time
   (`❌ Invalid environment variables: [...path: ["NEXT_PUBLIC_WEB_URL"]]`,
   `env.ts:11:13`). `LAUNCH_RUNBOOK.md` §2 already claims this var ✅
   confirmed on all 3 projects — that claim is DRIFT; the live build log
   says otherwise for `web` specifically. 🧑 **only fixable in the Vercel
   dashboard** (Settings → Environment Variables → `executar-nf-web` →
   confirm `NEXT_PUBLIC_WEB_URL` is actually set on the **Production**
   environment, not just Preview/Development) — no Vercel MCP tool in
   this session writes project env vars.
3. **`executar-nf-app` and `executar-nf-api` production ARE green** on
   the current `main` head (`dpl_HpGiXMDkkQ5urcgQ3bhb7sJiVnoc`, target
   production, READY; `api`'s `/health` returns live `200 OK`).
   `executar-nf-storybook` is READY. Contradicts nothing in
   `LAUNCH_RUNBOOK.md` — first live confirmation since PR #12 merged.
4. **`apps/app`'s live production HTML still shipped the next-forge
   scaffold's placeholder branding** (`<title>Acme Inc</title>`,
   `"My application."`, a fake "Sofia Davis" testimonial) — found by
   fetching the real deployed page, not by reading the source first.
   `apps/web` was already rebranded at M14; these two files in `apps/app`
   were missed. Fixed in PR #14 (reuses the real EXECUTAR copy already in
   `packages/internationalization/dictionaries/en.json`, removes the fake
   quote rather than inventing a real-looking one).
5. **`apps/app`'s Clerk instance is a Development instance, not
   Production.** The same live fetch shows unauthenticated visitors
   redirected to `https://shining-lacewing-1173.accounts.dev/sign-in` —
   an `accounts.dev` domain is Clerk's dev-instance frontend API, never
   a production one. Matches `LAUNCH_RUNBOOK.md` §4's already-known gap
   (production `CLERK_SECRET_KEY`/`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   still 🧑); this is now a *confirmed-live*, not just undocumented,
   instance of that gap.
6. **RLS confirmed live**, read-only, via `pg_tables.rowsecurity`: all
   28 workspace-scoped tables have `rowsecurity = true`; `Page` (global
   content) and `_prisma_migrations` correctly do not — matches the
   schema's own design, not a gap.
7. **Stripe test-mode webhook confirmed still live**: `we_1UEB5OQ...`,
   enabled, subscribed to the same 7 event types
   `apps/api/app/webhooks/payments/route.ts` handles, pointed at the
   real `executar-nf-api` URL. Unchanged from `LAUNCH_RUNBOOK.md` §5.
8. **`executar-nf-api`'s cron routes logged 2 Neon websocket errors**
   in the last 24h (`Unexpected server response: 101` against
   `.../v2` — Prisma's Neon serverless driver over a WebSocket,
   most likely a cold-start/compute-suspend edge case given the
   project's `autoscaling_limit_min_cu: 0.25` + short
   `suspend_timeout_seconds`). Not recurring enough (2 events, hours
   apart) to call a confirmed bug from this session alone — flagged for
   the next agent to watch via `get_runtime_errors`, not fixed blind.
9. **Resend account is real and connected but was completely empty**
   (0 domains, 0 API keys) — supersedes `LAUNCH_RUNBOOK.md` §6's
   "no connector for Resend" note; a Resend MCP connector exists in this
   session, it just had nothing provisioned yet. Created one real
   `sending_access` API key (`executar-nf-production`) — delivered to
   the user directly in chat (shown once by Resend, never committed).
   No domain purchased yet (§3, still a human/money decision), so
   `RESEND_FROM` should use Resend's own `onboarding@resend.dev` sandbox
   sender until a real domain exists and is verified.
10. **`deploy-web.yml`/`deploy-mobile.yml` both report `conclusion:
    skipped` on every recent push to `main`** — consistent with
    `vars.VERCEL_ORG_ID` (and friends) not actually existing as GitHub
    Actions repository variables, despite `LAUNCH_RUNBOOK.md` §9 marking
    `VERCEL_ORG_ID` ✅. No tool in this session reads/writes GitHub Actions
    repo variables to confirm directly — real production deploys are
    happening through Vercel's own git integration regardless, so this
    doesn't block GO by itself, but the CD workflow as documented has
    still never actually run for real. 🧑 to confirm/set in GitHub repo
    Settings → Secrets and variables → Actions.

**Not re-verified this session** (unchanged from `LAUNCH_RUNBOOK.md`,
no new evidence either way): Clerk production keys/webhook, domain
purchase, OpenAI live call, BaseHub (closed, N/A), WhatsApp/Gmail/Outlook,
EAS/mobile, live Stripe checkout dry run, LGPD export/delete round-trip,
Playwright E2E against real deployed URLs.

Full GO/NO-GO assessment against the 11 stated completion criteria is in
this session's own final report (not duplicated here).

## 2026-09-13 — Session handoff (network policy change, mid-session)

The plano de lançamento aprovado nesta sessão (workstreams A–G) vive só
no arquivo local de plan mode do container anterior — não está neste
repositório. Esta seção existe para a próxima sessão retomar sem esse
arquivo.

**Estado das PRs:**
- #13–#17: mergeadas (CI fix, branding, `.env.production` de `web`,
  legal/docs cleanup).
- #18 (`claude/fix-preview-db-parent-branch`): **aberta**, corrige o
  input inválido `parent_branch`→`parent` + `database: executar` em
  `.github/workflows/preview-db.yml`. Bloqueada não pelo código, mas por
  uma falha de infraestrutura do GitHub Actions do repositório inteiro
  (`startup_failure`, 0 jobs, em `CI`/`Security`/`Preview Database`,
  desde ~17:50 de 2026-09-13 — comentário detalhado já postado na PR).
  O usuário conferiu/resetou `Settings → Actions → General` (permissions
  corretas), mas **ainda não confirmado com um push/evento real** se
  isso resolveu. Próxima sessão: checar `actions_list` nessa branch; se
  ainda `startup_failure`, o problema não era permissions.

**Vercel — bloqueio de rede resolvido nesta sessão:**
`api.vercel.com`/`api.expo.dev` estavam bloqueados pela network policy
deste ambiente Claude Code (não é limitação da Vercel/Expo). O usuário
configurou **API credentials** no ambiente (não env vars comuns) para
os hosts `api.vercel.com` e `api.expo.dev` — o proxy injeta o token
automaticamente nessas requisições; o valor nunca fica visível nesta
sessão. Isso só vale a partir de uma sessão **nova** (mudança de
ambiente não retroage na sessão corrente).

Pendente para a próxima sessão, agora que a rede deve funcionar:
1. Confirmar com `curl -sS https://api.vercel.com/v2/user` (sem
   precisar montar header de auth — o proxy injeta) que o 403 sumiu.
2. Escrever `DATABASE_URL` via `POST /v10/projects/{id}/env?teamId=...`
   (`upsert=true`) — `executar-nf-web` (`prj_pa8ihwg7ReAncAAhZMBHdKTLMZr1`,
   Production **e** Preview), `executar-nf-app`
   (`prj_tjzeAZAoitSeuYf0RNEhmyakMiMo`, só Preview — Production já
   funciona), `executar-nf-api` (`prj_Ui40tk9orjhk5wq5tG90F5z65kiD`, só
   Preview). Team: `team_fJe21quDM0egDSTPE0CFwNnm`. Valor real via
   `mcp__Neon__get_connection_string` (projeto `snowy-dawn-65785764`,
   database `executar`) — não hardcodar em nenhum arquivo/commit.
3. Escrever `RESEND_TOKEN`/`RESEND_FROM=onboarding@resend.dev` nos
   mesmos 3 projetos (Production+Preview). Chave já criada nesta sessão
   (`executar-nf-vercel-2026-09-13` no Resend) — o valor foi mostrado ao
   usuário no chat, não está neste arquivo; se perdido, criar uma nova
   via `mcp__Resend__create-api-key`.
4. Disparar um redeploy de cada projeto depois de escrever os env vars
   (env var nova só vale a partir do próximo build) e confirmar via
   `mcp__Vercel__get_deployment_build_logs` que o erro `Invalid
   environment variables: [DATABASE_URL]` sumiu.
5. Expo: `EXPO_TOKEN` também configurado como API credential. Ainda
   **não existe projeto EAS** (`apps/mobile/app.json`'s
   `extra.eas.projectId` está vazio) e nenhuma ferramenta MCP do Expo
   cria um projeto novo — todas exigem `appId`/`appFullName` já
   existente. Com a rede liberada, tentar `cd apps/mobile && npx
   eas-cli init --non-interactive` (usa `EXPO_TOKEN` do ambiente
   automaticamente) como próximo passo real, algo que antes falhava só
   por bloqueio de rede.

**Ainda bloqueado, sem solução conhecida:** escrever secrets do GitHub
Actions (`VERCEL_TOKEN`, `EXPO_TOKEN`, `CHROMATIC_PROJECT_TOKEN` como
secrets do repositório) — o proxy recusa esse endpoint especificamente
(`Access to this GitHub Actions path is not permitted through this
proxy`, com link para a doc do Claude Code sobre GitHub Actions) mesmo
com a rede liberada — parece ser uma trava deliberada do produto, não
de política de rede configurável. Segue precisando de colagem manual do
usuário em `Settings → Secrets and variables → Actions`, se algum dia
for necessário para `deploy-web.yml`/`deploy-mobile.yml`.
