# `apps/web` E2E suite (M17-T01)

Real Playwright specs against a real running `apps/web` dev server — no
mocks. None of these specs need Clerk or a database; `apps/web` is the
public, credential-free marketing site.

## What this suite needs

Nothing external anymore — `apps/web`'s BaseHub dependency was removed
(content is local MDX under `packages/cms/content/{blog,legal}`, see
`LAUNCH_RUNBOOK.md` §6). No `BASEHUB_TOKEN` or any other content-provider
credential is required to run this suite.

## Running

```bash
cd apps/web && bunx playwright test
# or, from the repo root, for every app's suite at once:
bun run e2e
```

## Known blocker (confirmed live, not the old BaseHub issue)

`bun run dev --filter=web` currently fails on every route with:

```
⨯ Error: Failed to load external module next-mdx-remote-<hash>/rsc:
ResolveMessage: Cannot find module '@mdx-js/mdx' from
'apps/web/.next/dev/node_modules/next-mdx-remote-<hash>/dist/serialize.js'
```

Root cause: Turbopack's dev-mode handling of `next-mdx-remote` (an
RSC-external package) copies it into an isolated
`.next/dev/node_modules/next-mdx-remote-<hash>/` folder without also
copying its own dependency `@mdx-js/mdx` alongside it. Declaring
`@mdx-js/mdx` as an explicit dependency of `packages/cms` (done — see
its `package.json`) did not resolve it; this looks like an interaction
between bun's isolated-store install layout and Turbopack's dev-only
external-package copy step, not a missing dependency per se.

**This does not affect the production build** — confirmed by actually
running `bun run build --filter=web`, which compiles clean and never
hits this error (Turbopack's build-mode bundling doesn't go through the
same copy-into-`.next/dev` path as dev mode). It only blocks `next dev`
and, by extension, this Playwright suite (`playwright.config.ts`'s
`webServer.command` is `bun run dev`).

Until resolved, this suite cannot run locally. Worth trying next:
pinning `next-mdx-remote`/`@mdx-js/mdx` to matching major versions,
switching bun's linker to hoisted mode (`bunfig.toml`'s `install.linker
= "hoisted"`), or replacing `next-mdx-remote/rsc` with a different MDX
compiler less sensitive to this externalization path.
