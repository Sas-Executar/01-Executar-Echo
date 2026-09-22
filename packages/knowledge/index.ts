/**
 * @repo/knowledge — the EXECUTAR knowledge layer (browser-safe entry).
 *
 * Types, schemas and the transcribed editorial contract. Everything here
 * is importable from a client component.
 *
 * The graph *loader* reads from disk, so it lives behind
 * `@repo/knowledge/server` instead — importing it from here would pull
 * `node:fs` into the client bundle and fail the build. Same split as
 * `@repo/analytics/server` and `@repo/auth/server`.
 */
export * from "./src/cognitive-map";
export * from "./src/editorial";
