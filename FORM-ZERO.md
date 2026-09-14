# FORM-ZERO — Formulário Único da Fase Zero

```
ID       FORM-EXEC-1409-ZERO
VERSION  1.1.0  (corrigido contra o código em 2026-09-14 — ver §0)
OWNER    Leo
STATUS   USER_ACTION_REQUIRED
REGRA    Tudo que o lançamento inteiro exige de você está neste formulário.
         Item que aparecer depois disso é falha de planejamento, não pedido legítimo.
```

**Tempo estimado:** 25–40 minutos, a maior parte esperando painel de provedor carregar.

**Onde colocar os valores:** GitHub → `Sas-Executar/01-Executar-Echo` →
**Settings → Secrets and variables → Actions**.
Não cole nenhum valor em chat, em arquivo do repositório, em PR ou em comentário. O
`security.yml` faz varredura de segredo e reprova o commit.

---

## §0 — O que mudou da v1.0.0 para esta versão

| Mudança | Por quê | Evidência |
|---|---|---|
| §2 caiu de 3 variables para 1 | `VERCEL_ORG_ID` e `EAS_PROJECT_CONFIGURED` não são lidos por workflow nenhum | `grep -rn 'vars\.' .github/workflows/` → só `NEON_PROJECT_ID` |
| §3 — DEC-001, DEC-002 e DEC-005 já respondidas | decididas na sessão de 2026-09-14 | `DECISION_LOG.md` |
| §7 nova — DEC-005 | o pacote original não previu que o Linear já estaria populado | `GATE_LOG.md` FP-004 |
| Nota no §1 sobre `DATABASE_URL` | é a variável que está derrubando a `web`, não a URL pública | `docs/fase-zero/ADDENDUM-2026-09-14.md` §1 |

Os 7 secrets do §1 foram **confirmados** contra o código e permanecem como estavam.

---

## §1 — Secrets do GitHub Actions (aba **Secrets** → New repository secret)

Estes sete são o desbloqueio. Sem eles, a FASE-01 não roda e nenhuma outra fase começa.

| # | Nome do secret | Formato exigido | Onde obter | Destrava |
|---|---|---|---|---|
| 1 | `VERCEL_TOKEN` | token opaco | vercel.com → Settings → Tokens → Create, escopo do time `Sas_Executar` | **FASE-01** — é o que permite escrever env var na Vercel |
| 2 | `DATABASE_URL` | começa com `postgresql://` | Neon console → `executar-production` → Connection Details → role `executar_owner`, database `executar` | **FASE-01**, FASE-05 |
| 3 | `CLERK_WEBHOOK_SECRET` | **tem que começar com `whsec_`** | Clerk dashboard → Webhooks → endpoint → Signing Secret | FASE-01, FASE-04 |
| 4 | `RESEND_TOKEN` | **tem que começar com `re_`** | resend.com → API Keys | FASE-01, FASE-06 |
| 5 | `RESEND_FROM` | e-mail válido | o remetente do domínio verificado na Resend | FASE-01, FASE-06 |
| 6 | `NEON_API_KEY` | token opaco | Neon console → Account Settings → API Keys | FASE-05 |
| 7 | `EXPO_TOKEN` | token opaco | expo.dev → Access Tokens | FASE-11 |

Opcional, não bloqueia nada: `CHROMATIC_PROJECT_TOKEN` (chromatic.com) — sem ele o job
de regressão visual pula em vez de falhar.

> **Os nºs 1 e 2 são os que apagam o incêndio.** O build da `executar-nf-web` reprova
> hoje com `path: [ "DATABASE_URL" ], "expected string, received undefined"` — o
> projeto tem exatamente 2 env vars configuradas e `DATABASE_URL` não é uma delas. O
> `sync-vercel-env.yml` já mergeado sincroniza `DATABASE_URL` para `web` em
> `production,preview` e para `app`/`api` em `preview`. Com esses dois secrets
> gravados, a FASE-01 não precisa de mais nada de você.

> **Atenção ao nº 3.** Confira o prefixo antes de colar. Uma variável opcional com
> prefixo, preenchida errado, **não é ignorada** — reprova o schema inteiro e derruba o
> build. Em branco seria mais seguro que errada. São 16 variáveis nessa forma no
> monorepo; a FASE-01 blinda a classe inteira.

## §2 — Variables do GitHub Actions (aba **Variables** → New repository variable)

| Nome | Valor | Observação |
|---|---|---|
| `NEON_PROJECT_ID` | `snowy-dawn-65785764` | já conhecido, é só colar. Lido por `preview-db.yml` |

**Removidos da v1.0.0, não faça:** `VERCEL_ORG_ID` (passou a vir de
`config/deployment.json` no PR #21) e `EAS_PROJECT_CONFIGURED` (nunca foi lido —
`load-deployment-config.sh mobile` lê `expo.extra.eas.projectId` direto de
`apps/mobile/app.json`).

## §3 — Decisões

Respondidas em 2026-09-14, registradas em `DECISION_LOG.md`:

| ID | Decisão |
|---|---|
| DEC-001 | ✅ `Sas-Executar/01-Executar-Echo` é o repositório canônico |
| DEC-002 | ✅ Manter Neon (`aws-us-east-2`); Aurora sai do plano |
| DEC-005 | ✅ Time novo no Linear para o plano técnico; `Executar-Rotina` fica intacto |

### DEC-003 — Domínio e plano da Vercel · **ainda depende de você**

Hoje não existe domínio próprio, e o plano Hobby tem dois efeitos concretos: força SSO
em todos os `*.vercel.app` — o que bloqueia até o webhook do Clerk, já que
`executar-nf-api` está com `ssoProtection` em `all_except_custom_domains` e não há
domínio custom — e limita cron a 1×/dia, o que degradou o EXECUTAR Rotina de 15 minutos
para uma vez por dia.

- **Nome do domínio que você quer:** `A DEFINIR`
- **Autoriza a compra pelo conector da Vercel, dentro de qual teto de preço?** `A DEFINIR`
- **Autoriza upgrade para o plano Pro?** `A DEFINIR`

**Trava FASE-04, FASE-07 e FASE-10.**

### DEC-004 — Scanner: OCR ou DINOv2/ONNX · `A DEFINIR`

Reversível e barata se decidida antes da FASE-10 começar. **Trava FASE-10.**

## §4 — Dados para submissão às lojas e páginas legais

Você não vai preencher formulário de loja nenhum. Me dê os dados uma vez e eu preencho
tudo na FASE-11.

| Campo | Usado em | Sua resposta |
|---|---|---|
| Nome legal (pessoa ou empresa) | lojas, termos de uso | `A DEFINIR` |
| CNPJ ou CPF | lojas, Stripe | `A DEFINIR` |
| Endereço completo | lojas, termos | `A DEFINIR` |
| Telefone de suporte | lojas | `A DEFINIR` |
| E-mail de suporte | lojas, termos, privacidade | `A DEFINIR` |
| E-mail do encarregado de dados (LGPD) | política de privacidade | `A DEFINIR` |
| Conta Apple Developer Program — existe? | FASE-11 | `A DEFINIR` |
| Conta Google Play Console — existe? | FASE-11 | `A DEFINIR` |
| KYC da Stripe aprovado? | FASE-06 (livemode) | `A DEFINIR` |

Se as contas de desenvolvedor ainda não existirem, diga — a FASE-11 se reorganiza para
criá-las como primeira tarefa, em vez de travar no meio.

## §5 — Integrações externas (opcionais, cada uma destrava um canal na FASE-10)

Marque só as que quer no lançamento. As não marcadas ficam `A DEFINIR`, sem travar nada.

| Canal | O que preciso | Quer no lançamento? |
|---|---|---|
| WhatsApp | app Meta Cloud API + número real → `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_API_VERSION` | `A DEFINIR` |
| Gmail | projeto Google Cloud + OAuth client + tópico Pub/Sub → `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REDIRECT_URI`, `GOOGLE_PUBSUB_AUDIENCE` | `A DEFINIR` |
| Outlook | registro de app no Azure AD → `OUTLOOK_CLIENT_ID`, `OUTLOOK_CLIENT_SECRET`, `OUTLOOK_REDIRECT_URI` | `A DEFINIR` |
| OpenAI | chave começando com `sk-` | já configurada em `executar-nf-api` e `executar-nf-app` |
| PostHog / Sentry / BetterStack | chaves de observabilidade e analytics | `A DEFINIR` |

`INTEGRATIONS_ENCRYPTION_KEY` eu gero — `openssl rand -base64 32`, valor distinto por
ambiente. Não precisa de você.

## §6 — Autorizações

Estado atual em `AUTHORIZATIONS.md`. Falta só uma:

| Autorização | Recomendado | Sua resposta |
|---|---|---|
| Publicar a matriz e os CSVs no seu Google Drive (A-08) | Sim | `A DEFINIR` |
| Escrever env var na Vercel pela API REST direta, além do workflow (A-05) | Não — o workflow deixa rastro em CI | `A DEFINIR` |

## §7 — DEC-005, resolvida

O Linear já estava populado com ~190 issues de outro plano quando este pacote chegou.
Sua decisão: time novo para o plano técnico, `Executar-Rotina` intacto. Nada a fazer.

---

## Checklist de conclusão da Fase Zero

- [ ] 7 secrets gravados — os nºs 1 e 2 sozinhos já destravam a FASE-01
- [ ] 1 variable gravada (`NEON_PROJECT_ID`)
- [x] DEC-001, DEC-002 e DEC-005 respondidas
- [ ] DEC-003 respondida
- [ ] DEC-004 respondida (pode esperar até a FASE-10)
- [ ] Dados de §4 fornecidos
- [ ] §5 marcado (mesmo que tudo fique como `A DEFINIR`)
- [ ] §6 autorizado

## Como confirmar que deu certo, sem me dizer nada

Actions → **Sync Vercel Env** → Run workflow (deixe `redeploy_production` desmarcado).
O primeiro passo lê a configuração e, se faltar algo, falha dizendo exatamente o nome:

```
::error::Deployment blocked. Missing: VERCEL_TOKEN at least one application secret to synchronize
```

Se passar desse ponto, os secrets estão certos e a FASE-01 pode começar.
