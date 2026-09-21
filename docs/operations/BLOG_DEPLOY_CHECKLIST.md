# BLOG_DEPLOY_CHECKLIST — EXECUTAR

**Status:** ACTIVE  
**Owner surface:** `apps/web`  
**Content source:** `packages/cms/content/blog/*.mdx`  
**Deployment target:** Vercel project for `apps/web`  
**Workflow:** `.github/workflows/deploy-web.yml`  
**Method:** adapted from Anthropic Knowledge Work Engineering `deploy-checklist` + `documentation` skills, reconciled with the real repository.

## 1. Purpose

This is the canonical operational checklist for publishing and releasing the EXECUTAR Blog. It is written for humans and AI agents. A checklist item is only complete when the evidence field names a checkable artifact: commit SHA, PR, CI run, preview URL, production URL, log, or test result.

Repository maturity rule applies: `documented != implemented != functional != tested != verified != deployed != released`.

## 2. Current architecture

```text
packages/cms/content/blog/*.mdx
        |
        v
packages/cms/lib/posts.ts
        |
        v
@repo/cms
        |
        +--> apps/web/app/[locale]/blog/page.tsx
        +--> apps/web/app/[locale]/blog/[slug]/page.tsx
        +--> apps/web/app/[locale]/sitemap.ts
        |
        v
Next.js build / Vercel deployment
```

The Blog is not a standalone app. It is part of `apps/web`. Local MDX is the current content source of truth; publishing is repository-driven.

## 3. Release status model

Use one status per gate:

- `PASS` — verified with current evidence.
- `FAIL` — verification executed and failed.
- `BLOCKED` — required external dependency or prerequisite is unavailable.
- `NOT_RUN` — verification has not been executed for this release.
- `N/A` — explicitly not applicable, with rationale.

No release may be called `DONE_VERIFIED` while a blocking gate is `FAIL`, `BLOCKED`, or `NOT_RUN`.

---

# Deploy Checklist: EXECUTAR Blog

**Release:** ____________________  
**Date:** ____________________  
**Deployer/agent:** ____________________  
**Commit SHA:** ____________________  
**PR:** ____________________  
**Preview URL:** ____________________  
**Production URL:** ____________________

## A. Pre-Deploy — Source and scope

- [ ] Release scope is declared: content-only, Blog UI, CMS/runtime, SEO, integrations, or mixed.
- [ ] All intended Blog changes are in the release diff.
- [ ] PR is reviewed/approved according to repository governance.
- [ ] No known critical Blog defect is accepted into the release.
- [ ] Every new article exists under `packages/cms/content/blog/`.
- [ ] Slugs are unique and path-safe.
- [ ] Required frontmatter is present: `title`, `description`, `date`.
- [ ] Optional `image` references resolve to a deployable asset when used.
- [ ] Editorial/legal approvals required by release scope are recorded.

**Evidence:** ____________________

## B. Pre-Deploy — CMS and content contract

- [ ] `packages/cms/__tests__/posts.test.ts` passes.
- [ ] Every committed Blog MDX resolves through `getPostsMeta("blog")`.
- [ ] Every article compiles as MDX without runtime/compiler error.
- [ ] Article order is correct by publication date.
- [ ] Reading-time generation succeeds.
- [ ] No post expected for release falls back to epoch/default metadata.
- [ ] Path traversal guard remains intact for slug reads.

**Minimum command evidence:**

```bash
bun install --frozen-lockfile
bun run test
```

**Evidence:** ____________________

## C. Pre-Deploy — Static quality gates

- [ ] Lint passes with zero blocking errors.
- [ ] Typecheck passes for all packages.
- [ ] Web production build succeeds.
- [ ] MDX files are included in the serverless output through `outputFileTracingIncludes`.
- [ ] No unexpected dependency/config change is introduced by the build.

```bash
bunx ultracite check .
bun run typecheck
bunx turbo run build --filter=web
```

**Evidence:** ____________________

## D. Pre-Deploy — Routes and render

Blocking route contract for the current implementation:

- [ ] `/blog` renders.
- [ ] Every `packages/cms/content/blog/<slug>.mdx` resolves at `/blog/<slug>`.
- [ ] Unknown slug returns the expected not-found behavior.
- [ ] Article title, description, date and reading time render correctly.
- [ ] Back-to-Blog navigation works.
- [ ] Images render without broken source when present.

**Critical invariant:** every Blog MDX committed for publication must map to a production HTTP 200 article URL.

**Evidence:** ____________________

## E. Pre-Deploy — SEO and discovery

- [ ] Blog index metadata renders.
- [ ] Article metadata uses article title/description/image.
- [ ] `Blog` JSON-LD renders on the index.
- [ ] `BlogPosting` JSON-LD renders on articles.
- [ ] `/sitemap.xml` contains every published Blog slug.
- [ ] `/robots.txt` references the production sitemap.
- [ ] Canonical URL policy is verified for the release.
- [ ] Internal-linking and redirects required by the editorial specification are verified.

**Evidence:** ____________________

## F. Pre-Deploy — Blog launch requirements

The Blog launch input explicitly calls for validation of these capabilities. They remain release gates when they are part of the approved launch scope:

- [ ] Analytics/KPI instrumentation validated.
- [ ] Comments behavior validated, or explicitly marked out-of-scope by an approved decision.
- [ ] Newsletter capture/CTA validated.
- [ ] Social sharing validated.
- [ ] Submission-to-production editorial workflow validated.
- [ ] Ecosystem routes/deep links in release scope are validated: tools/Oficina, VERA Copilot, Mapa Executivo, Quick Frameworks.

Do not mark these as implemented from this document alone.

**Evidence / decision IDs:** ____________________

## G. Deploy

- [ ] CI for the release commit is green.
- [ ] Preview deployment is available and inspected.
- [ ] Preview smoke test covers `/blog` plus every changed/new slug.
- [ ] Production deploy uses the existing controlled Web workflow.
- [ ] Deployment URL/ID is captured before post-deploy validation.
- [ ] Production alias resolves to the intended deployment.

**Current repository note:** `deploy-web.yml` deploys `app`, `web`, and `api` after the migration/configuration gate. A Blog-only change is therefore currently coupled to the broader Web deployment workflow.

**Evidence:** ____________________

## H. Post-Deploy smoke

Run against the stable production alias, not only a protected raw deployment URL.

- [ ] `GET /blog` returns a successful response.
- [ ] Every changed/new `GET /blog/<slug>` returns HTTP 200.
- [ ] At least one previously published article still returns HTTP 200.
- [ ] Article body is present, not only shell metadata.
- [ ] `/sitemap.xml` includes all expected Blog slugs.
- [ ] `/robots.txt` is reachable.
- [ ] No new critical server/runtime error appears in deployment logs.
- [ ] Key Blog journey works: discovery -> article -> navigation/CTA.
- [ ] Analytics event flow works when analytics is in release scope.

**Evidence:** ____________________

## I. Post-Deploy completion

- [ ] Metrics/logs checked after release.
- [ ] Release note or execution log updated.
- [ ] Related Blog ticket/work item updated.
- [ ] Evidence links recorded.
- [ ] Any drift discovered between docs and live behavior is corrected.
- [ ] Release status set to `DONE_VERIFIED` only after production smoke passes.

## J. Rollback triggers

Rollback is required when any of the following is observed after production deployment:

1. `/blog` fails or becomes unavailable.
2. Any article intentionally published in the release returns 404/5xx.
3. MDX content is absent from the production bundle.
4. Sitemap drops an expected published article.
5. A release introduces a critical rendering/navigation failure in the Blog journey.
6. Error rate or latency shows a material release-correlated regression against the current production baseline.
7. A security/privacy defect is introduced.
8. A required launch integration in the approved release scope fails and cannot be safely disabled.

## K. Rollback procedure

1. Stop further promotion/deploy activity.
2. Capture failing URL, deployment ID, commit SHA and logs.
3. Roll back the Vercel production deployment to the last known-good deployment.
4. Re-run `/blog`, known article, changed article, sitemap and robots smoke tests.
5. Record the incident/failure evidence before reopening deployment.
6. Fix forward on a new PR; do not rewrite evidence from the failed release.

Example operational command:

```bash
vercel rollback <deployment-url-or-id> --token="$VERCEL_TOKEN"
```

Never place the token value in repository documentation or logs.

## 4. Known current gaps

At activation time, repository evidence shows:

- CI has lint/typecheck/tests but the general CI workflow does not use a full build as a blocking PR gate.
- Web E2E exists, but there is no Blog-specific Playwright spec.
- Production health check in `deploy-web.yml` targets `/`, not `/blog` or article slugs.
- The CMS unit test proves disk-to-metadata resolution but cannot prove that MDX files reached the deployed serverless bundle.
- Blog launch inputs identify analytics, comments, newsletter, social sharing and submission/production validation; this checklist treats them as explicit gates when included in launch scope.

These are gaps to close with executable automation. Their presence must not be hidden by marking documentation complete.

## 5. Evidence record

```yaml
release:
  commit: ""
  pr: ""
  ci_run: ""
  preview_url: ""
  production_deployment: ""
gates:
  source_scope: NOT_RUN
  cms_content: NOT_RUN
  quality: NOT_RUN
  routes_render: NOT_RUN
  seo_discovery: NOT_RUN
  launch_requirements: NOT_RUN
  deploy: NOT_RUN
  production_smoke: NOT_RUN
rollback:
  last_known_good_deployment: ""
  triggered: false
  reason: ""
result: NOT_RUN
```
