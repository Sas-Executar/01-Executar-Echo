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

## 2026-09-13 — Continuação (rede liberada; credenciais de API inválidas)

Sessão nova, conforme pedido no handoff acima. Resultado líquido: a
**política de rede** foi de fato corrigida, mas as **credenciais**
configuradas para `api.vercel.com`/`api.expo.dev` são rejeitadas pelos
próprios provedores — dois problemas diferentes, o segundo só visível
depois que o primeiro foi resolvido.

**1. Rede confirmada liberada (item pendente #1 do handoff):**
`curl -v https://api.vercel.com/v2/user` e `https://api.expo.dev/v2/...`
completam o handshake TLS e chegam de fato aos servidores da Vercel/Expo
(certificados `CN=api.vercel.com`/`CN=api.expo.dev` reais, respostas com
headers `Server: Vercel` / `Server: cloudflare`) — não é mais o 403 de
proxy (`X-Proxy-Error: upstream denied...`) do bloqueio de rede antigo.
Isso por si só já é a confirmação pedida no item 1.

**2. Mas a credencial injetada é inválida nos dois hosts (achado novo,
não estava no handoff):**
- Vercel: toda chamada devolve `403 {"error":{"code":"forbidden",
  "message":"Not authorized","invalidToken":true}}` — e o próprio proxy
  expõe `X-Proxy-Error: upstream denied the request: connection
  "Vecrel", rule "Api.vercel.com", host "api.vercel.com"`, ou seja, o
  proxy **tentou** injetar o token (a regra bateu), mas a própria Vercel
  recusou o token como inválido.
- Expo: toda chamada devolve `401 {"errors":[{"code":
  "AUTHENTICATION_ERROR","message":"The bearer token is invalid."}]}`.
  Confirmado em três camadas independentes — `curl` cru, `vercel whoami`
  (CLI, "Logged out"), e `eas-cli whoami`/`eas-cli init --non-interactive`
  com `EXPO_TOKEN=<placeholder>` só para forçar a chamada de rede real
  (o eas-cli recusa localmente, sem nem tentar a rede, se não vir
  `EXPO_TOKEN` setado como env var literal — diferente do proxy, que
  injeta no header HTTP independente do que o cliente manda) — mesmo erro
  exato nas três.
- Conclusão: **não é mais bloqueio de rede nem limitação de ferramenta —
  é a credencial em si (a "API credential" configurada pelo usuário para
  esses dois hosts no ambiente) que a Vercel/Expo rejeitam.** 🧑 só o
  usuário pode corrigir isso (reconferir/recriar a API credential desses
  dois hosts nas configurações do ambiente Claude Code) — nenhuma
  ferramenta desta sessão tem acesso ao valor do token para diagnosticar
  mais fundo.

**3. `DATABASE_URL`/`RESEND_TOKEN`/`RESEND_FROM` nos 3 projetos Vercel
(itens 2–4 do handoff): continua bloqueado, agora por (2) acima.** IDs de
projeto reconferidos via `mcp__Vercel__list_projects` — batem exatamente
com o handoff (`executar-nf-web` `prj_pa8ihwg7ReAncAAhZMBHdKTLMZr1`,
`executar-nf-app` `prj_tjzeAZAoitSeuYf0RNEhmyakMiMo`, `executar-nf-api`
`prj_Ui40tk9orjhk5wq5tG90F5z65kiD`). As ferramentas MCP do Vercel nesta
sessão (`list_projects`/`get_project`/`list_teams`) funcionam normalmente
— usam um conector OAuth próprio, independente da API credential quebrada
— mas nenhuma delas lê ou escreve env vars de projeto; a escrita real só
é possível via `POST /v10/projects/{id}/env`, que exige a API credential
que está inválida. Sem solução nesta sessão até a credencial ser
corrigida.

**4. EAS init (item 5 do handoff): mesma conclusão — tentado de verdade,
falhou por credencial, não por rede.** `extra.eas.projectId` em
`apps/mobile/app.json` segue vazio. `eas-cli init --non-interactive`
chega a rodar (a rede permite), mas falha em
`The bearer token is invalid.` assim que tenta autenticar — mesmo erro
do item 2. Continua exigindo um `EXPO_TOKEN` válido antes de poder criar
o projeto EAS.

**5. PR #18 (item "confirmar" desta tarefa): desbloqueada e validada ao
vivo — merge pendente de deploys Vercel em andamento.**
- Confirmado via `actions_list`/`actions_get` que o `startup_failure`
  do Actions (reportado no handoff) já tinha se resolvido **antes** desta
  sessão: a PR #19 (mergeada às 18:45–18:47) rodou `CI`/`Security` com
  `conclusion: success` e `Preview Database` com `conclusion: failure`
  (não mais `startup_failure` — os jobs chegaram a ser criados e rodar,
  só falharam pelo motivo real de antes: `parent_branch` inválido,
  já que aquela branch não tinha o fix da PR #18). Ou seja, a correção do
  usuário em `Settings → Actions → General` funcionou.
- A PR #18 em si ainda não tinha sido testada com o Actions já corrigido
  (o run que ela tinha era o `startup_failure` antigo, e GitHub recusa
  re-run de um `startup_failure`: `403 This workflow run cannot be
  retried`). Sem `workflow_dispatch` em nenhum dos 3 workflows, o único
  jeito de gerar um evento novo era um push real — mesclei `main` (que já
  incorporava a PR #19) na branch `claude/fix-preview-db-parent-branch`
  (merge limpo, sem conflito) e fiz push
  (`6ef6cd2..25997f9`).
- Resultado do run novo, ao vivo: **todos os 10 checks passaram**,
  incluindo `Create + migrate preview branch` (o job que a própria PR
  promete validar) — a branch de preview do Neon foi criada e a migration
  rodou de verdade contra ela. O fix (`parent_branch`→`parent` +
  `database: executar`) está confirmado funcionando, não só validado por
  YAML estático.
- `mergeable_state` segue `unstable` só porque os 4 deploys de preview da
  Vercel (`executar-nf-web/app/api/storybook`) ainda estavam `pending` no
  momento da checagem — sem review humano pendente nesta PR. Deve virar
  mergeável assim que os previews da Vercel terminarem; próxima sessão
  (ou o restante desta) confere `get_status`/`pull_request_read` de novo
  antes de mergear.

**Sem novidade:** secrets do GitHub Actions (`VERCEL_TOKEN`/`EXPO_TOKEN`/
`CHROMATIC_PROJECT_TOKEN`) seguem bloqueados pelo mesmo motivo do handoff
anterior (trava de produto do proxy nesse endpoint específico, não
política de rede) — não testado de novo nesta sessão por já estar bem
documentado.

## 2026-09-13 — Achado urgente: `executar-nf-api` produção parada desde ~16:48

Encontrado investigando por que o preview da PR #20 (só
`WORKFLOW_01_01_EXECUTION_LOG.md`, nenhum código) falhou no deploy da
Vercel — a causa não tinha nada a ver com esta PR.

**Causa raiz (confirmada pelo log real do build, `get_deployment_build_logs`):**
```
❌ Invalid environment variables: [
  { code: "invalid_format", format: "starts_with", prefix: "whsec_",
    path: [ "CLERK_WEBHOOK_SECRET" ],
    message: "Invalid string: must start with \"whsec_\"" }
]
```
`packages/auth/keys.ts:9` — `CLERK_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional()`.
O campo é opcional (undefined passaria), mas **há um valor configurado no
projeto Vercel que não começa com `whsec_`** — provavelmente colado
errado (chave do Clerk em vez do signing secret do webhook, ou com aspas/
espaço/truncado).

**Isso não é só um problema de preview — produção do `executar-nf-api`
está parada nesse mesmo erro desde ~16:48 de hoje**, confirmado via
`mcp__Vercel__list_deployments(target=preview... e produção)`:
- Último build de produção com sucesso: `dpl_HA77vZqQkwzJApPmsgEM7DJhDgWU`
  (merge da PR #15, `58204db`, `READY`, criado 2026-09-13 16:18 UTC).
- Um redeploy manual do **mesmo commit**, ~30 min depois
  (`dpl_5ccVfvGSZdW7GtB5LNwN4dd7M7Dy`, 16:48 UTC), já veio `ERROR` com o
  mesmo `CLERK_WEBHOOK_SECRET` inválido — ou seja, a variável de ambiente
  foi alterada/adicionada nesse intervalo, não o código.
- Todo merge em `main` desde então ficou `ERROR` em produção: PR #17
  (`d1f0779`), PR #19 (`1b48c13`), PR #18 (`8150218`) — as 3 build falhas
  reais, não flake (mesmo erro determinístico nas 3).
- Efeito prático: a Vercel **não promove** um build que falha, então o
  alias de produção (`executar-nf-api-sas-executar1.vercel.app`) segue
  servindo o binário da PR #15 — não está "fora do ar", mas está **~4
  merges atrasado** (não recebeu nada das PRs #16–#19) até esse env var
  ser corrigido.
- Achado colateral (não investigado a fundo, fora do escopo desta
  sessão): esse mesmo domínio de produção respondeu `302` para
  `vercel.com/sso-api` num `curl` direto ao `/health` — confirmado via
  `get_project_deployment_protection`: SSO Protection está `enabled`,
  `all_except_custom_domains`. Como não há domínio customizado
  configurado neste projeto (`get_project` só lista domínios
  `*.vercel.app`), isso bloquearia até chamadas legítimas — inclusive o
  próprio webhook do Clerk apontado para essa mesma URL
  (`LAUNCH_RUNBOOK.md` linha 122). Não confirmado se isso é regressão
  recente ou já preexistente; fica registrado para a próxima sessão
  investigar se for relevante.

**Ação necessária, 🧑 only:** Vercel dashboard → projeto
`executar-nf-api` → Settings → Environment Variables → corrigir (ou
remover, já que é opcional) `CLERK_WEBHOOK_SECRET` nos ambientes
Production e Preview para um valor real começando com `whsec_` (o
webhook signing secret do Clerk, não a API key) — depois disso, redeploy
para confirmar. Nenhuma ferramenta desta sessão escreve env vars de
projeto Vercel (mesmo limite já documentado acima), então não pude
corrigir isso diretamente.
