# FORM-ZERO — Formulário Único da Fase Zero

```
ID       FORM-EXEC-1409-ZERO
VERSION  1.0.0
OWNER    Leo
STATUS   USER_ACTION_REQUIRED
REGRA    Tudo que o lançamento inteiro exige de você está neste formulário.
         Item que aparecer depois disso é falha de planejamento, não pedido legítimo.
```

**Tempo estimado:** 40–60 minutos, a maior parte esperando painel de provedor carregar.

**Onde colocar os valores:** GitHub → repositório `Sas-Executar/01-Executar-Echo` → **Settings → Secrets and variables → Actions**.
Não cole nenhum valor em chat, em arquivo do repositório, em PR ou em comentário. O `security.yml` faz varredura de segredo e reprova o commit.

---

## §1 — Secrets do GitHub Actions (aba **Secrets** → New repository secret)

Estes sete são o desbloqueio. Sem eles, a FASE-01 não roda e nenhuma outra fase começa.

| # | Nome do secret | Formato exigido | Onde obter | Destrava |
|---|---|---|---|---|
| 1 | `VERCEL_TOKEN` | token opaco | vercel.com → Settings → Tokens → Create, escopo do time `Sas_Executar` | **FASE-01** — é o que permite escrever env var na Vercel |
| 2 | `DATABASE_URL` | começa com `postgresql://` | Neon console → `executar-production` → Connection Details → role `executar_owner`, database `executar` | FASE-01, FASE-05 |
| 3 | `CLERK_WEBHOOK_SECRET` | **tem que começar com `whsec_`** | Clerk dashboard → Webhooks → endpoint → Signing Secret | FASE-01, FASE-04 |
| 4 | `RESEND_TOKEN` | **tem que começar com `re_`** | resend.com → API Keys | FASE-01, FASE-06 |
| 5 | `RESEND_FROM` | e-mail válido | o remetente do domínio verificado na Resend | FASE-01, FASE-06 |
| 6 | `NEON_API_KEY` | token opaco | Neon console → Account Settings → API Keys | FASE-05 |
| 7 | `EXPO_TOKEN` | token opaco | expo.dev → Access Tokens | FASE-11 |

Opcional, não bloqueia nada: `CHROMATIC_PROJECT_TOKEN` (chromatic.com) — sem ele o job de regressão visual pula em vez de falhar.

> **Atenção ao nº 3.** O valor atualmente configurado em `executar-nf-api` **não começa com `whsec_`**, e é exatamente isso que mantém a produção da API quebrada desde 13/09, servindo binário de quatro merges atrás. Confira o prefixo antes de colar.

## §2 — Variables do GitHub Actions (aba **Variables** → New repository variable)

| Nome | Valor | Observação |
|---|---|---|
| `NEON_PROJECT_ID` | `snowy-dawn-65785764` | já conhecido, é só colar |
| `VERCEL_ORG_ID` | `team_fJe21quDM0egDSTPE0CFwNnm` | já conhecido, é só colar |
| `EAS_PROJECT_CONFIGURED` | `false` | vira `true` sozinho na FASE-11 |

## §3 — Três decisões que só você pode tomar

Responda cada uma com uma frase. Elas vão para `DECISION_LOG.md` e destravam as fases 4, 5 e 10.

### DEC-001 — Qual é o repositório canônico?
O corpus documental (D20) diz que o repositório canônico é `Sas-Executar/Sas-Executar`. O que está rodando de verdade, com 7 projetos Vercel e todo o código de produto, é `Sas-Executar/01-Executar-Echo`.
**Recomendação:** adotar `01-Executar-Echo` como canônico e atualizar o registro documental, porque é onde estão os 33 packages, os 60 endpoints e todo o histórico de CI. A alternativa custaria migração completa sem ganho.
**Sua resposta:** `A DEFINIR`

### DEC-002 — Neon ou AWS Aurora?
O corpus aprova AWS Aurora PostgreSQL privado em `sa-east-1`. O que roda é Neon em `aws-us-east-2`, com 30 tabelas, RLS ativo e 8 migrations aplicadas.
**Recomendação:** manter Neon para o lançamento e reclassificar o registro de arquitetura — a integração de branch por PR já funciona e migrar agora atrasaria tudo. Se mantiver, a transferência internacional de dados continua declarada no aviso de privacidade (já está).
**Importante:** essa decisão fica muito mais cara depois que houver dado real de usuário. É agora.
**Sua resposta:** `A DEFINIR`

### DEC-003 — Domínio e plano da Vercel
Hoje não existe domínio próprio, e o plano Hobby tem dois efeitos concretos: força SSO em todos os `*.vercel.app` (o que bloqueia até o webhook do Clerk) e limita cron a 1×/dia (o EXECUTAR Rotina foi de 15 minutos para uma vez por dia por causa disso).
- **Nome do domínio que você quer:** `A DEFINIR`
- **Autoriza a compra pelo conector da Vercel, dentro de qual teto de preço?** `A DEFINIR`
- **Autoriza upgrade para o plano Pro?** `A DEFINIR`

## §4 — Dados para submissão às lojas e páginas legais

Você não vai preencher formulário de loja nenhum. Me dê os dados uma vez e eu preencho tudo na FASE-11.

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

Se as contas de desenvolvedor ainda não existirem, diga — a FASE-11 se reorganiza para criá-las como primeira tarefa, em vez de travar no meio.

## §5 — Integrações externas (opcionais, cada uma destrava um canal na FASE-10)

Marque só as que quer no lançamento. As não marcadas ficam registradas como `A DEFINIR`, sem travar nada.

| Canal | O que preciso | Quer no lançamento? |
|---|---|---|
| WhatsApp | app Meta Cloud API + número real → `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_API_VERSION` | `A DEFINIR` |
| Gmail | projeto Google Cloud + OAuth client + tópico Pub/Sub → `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REDIRECT_URI`, `GOOGLE_PUBSUB_AUDIENCE` | `A DEFINIR` |
| Outlook | registro de app no Azure AD → `OUTLOOK_CLIENT_ID`, `OUTLOOK_CLIENT_SECRET`, `OUTLOOK_REDIRECT_URI` | `A DEFINIR` |
| OpenAI | chave começando com `sk-` | `A DEFINIR` |
| PostHog / Sentry / BetterStack | chaves de observabilidade e analytics | `A DEFINIR` |

`INTEGRATIONS_ENCRYPTION_KEY` eu gero — `openssl rand -base64 32`, valor distinto por ambiente. Não precisa de você.

## §6 — Autorizações

| Autorização | Recomendado | Sua resposta |
|---|---|---|
| Abrir PR automático ao fim de cada fase, sem pedir | **Sim** (você já autorizou no 14-09.md item 15a) | `A DEFINIR` |
| Parar obrigatoriamente ao fim de cada gate para você validar e ajustar modelo/esforço | **Sim** | `A DEFINIR` |
| Publicar a matriz e os CSVs no seu Google Drive | **Sim** | `A DEFINIR` |
| Popular o Linear diretamente via conector, caso a pasta do Drive não sincronize | **Sim** | `A DEFINIR` |

---

## Checklist de conclusão da Fase Zero

- [ ] 7 secrets gravados — confirmável por `gh secret list`
- [ ] 3 variables gravadas — confirmável por `gh variable list`
- [ ] DEC-001, DEC-002 e DEC-003 respondidas
- [ ] Dados de §4 fornecidos
- [ ] §5 marcado (mesmo que tudo fique como `A DEFINIR`)
- [ ] §6 autorizado

Com isso, a FASE-01 começa e você não precisa fazer mais nada até o primeiro gate.
