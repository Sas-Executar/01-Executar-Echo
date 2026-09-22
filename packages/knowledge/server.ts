/**
 * @repo/knowledge/server — server-only entry.
 *
 * Reads the vendored cognitive map from disk. Keep this out of client
 * components: it imports `node:fs`, which Turbopack cannot bundle for the
 * browser. Pass the loaded graph down as props instead.
 */
import "server-only";

export * from "./src/load-cognitive-map";
