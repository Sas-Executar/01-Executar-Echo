import https from "node:https";
import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { keys } from "./keys";

/**
 * Temporary instrumentation for the production 500s on /cron/keep-alive
 * and /cron/routines ("Error: Unexpected server response: 101").
 *
 * The failure only reproduces inside Vercel's serverless runtime: the
 * same driver, the same `ws` version and the same pooler host all
 * complete the handshake from a local sandbox, and three hypotheses
 * (Bun vs Node, Sentry/OpenTelemetry HTTP instrumentation, and a bundler
 * inlining `ws`) were each tested and refuted there. What is left can
 * only be answered from inside a Lambda.
 *
 * "Unexpected server response: 101" is `ws` reporting that Node emitted
 * a `response` event where it expected `upgrade` — 101 is the *success*
 * status for a WebSocket handshake. That happens when the 101 reaches
 * Node without the header marking it as an upgrade. rawUpgradeProbe is
 * the one that can show this directly, because it listens for both
 * events and reports the status and headers it actually saw; `ws`
 * collapses both into the same opaque message.
 *
 * This lives here rather than in apps/api because it needs
 * @neondatabase/serverless and ws, which are this package's
 * dependencies and not the API's. It is an instrument, not a product
 * surface — delete it once P0-02 has a root cause.
 */

const HANDSHAKE_TIMEOUT_MS = 10_000;
const HYPHEN = /-/g;

export interface Probe {
  detail?: Record<string, unknown>;
  name: string;
  outcome: string;
}

export interface NeonDiagnostics {
  host: string;
  probes: Probe[];
  runtime: Record<string, unknown>;
}

const describeError = (error: unknown): string =>
  error instanceof Error ? `${error.name}: ${error.message}` : String(error);

const socketKey = (): string =>
  Buffer.from(crypto.randomUUID().replace(HYPHEN, "").slice(0, 16)).toString(
    "base64"
  );

/**
 * Ask for the WebSocket upgrade by hand, so we can see which event Node
 * delivers and what the intermediary actually returned.
 */
const rawUpgradeProbe = (host: string): Promise<Probe> =>
  new Promise((resolve) => {
    const name = "raw https upgrade";
    const request = https.request({
      host,
      path: "/v2",
      method: "GET",
      headers: {
        Connection: "Upgrade",
        Upgrade: "websocket",
        "Sec-WebSocket-Version": "13",
        "Sec-WebSocket-Key": socketKey(),
      },
    });

    const settle = (probe: Probe) => {
      request.destroy();
      resolve(probe);
    };

    request.on("upgrade", (response) => {
      settle({
        name,
        outcome: "UPGRADE event — this is what a healthy handshake does",
        detail: {
          statusCode: response.statusCode,
          connection: response.headers.connection,
          upgrade: response.headers.upgrade,
        },
      });
    });

    request.on("response", (response) => {
      settle({
        name,
        outcome: "RESPONSE event — the 101 arrived without its upgrade flag",
        detail: {
          statusCode: response.statusCode,
          httpVersion: response.httpVersion,
          headers: response.headers,
        },
      });
    });

    request.on("error", (error) => {
      settle({ name, outcome: `ERROR -> ${describeError(error)}` });
    });

    request.setTimeout(HANDSHAKE_TIMEOUT_MS, () => {
      settle({ name, outcome: "TIMEOUT" });
    });

    request.end();
  });

const wsHandshakeProbe = (host: string): Promise<Probe> =>
  new Promise((resolve) => {
    const name = "ws handshake (what the Prisma adapter does)";
    const socket = new ws(`wss://${host}/v2`);
    let settled = false;

    const settle = (outcome: string) => {
      if (settled) {
        return;
      }
      settled = true;
      socket.terminate();
      resolve({ name, outcome });
    };

    socket.on("open", () => settle("HANDSHAKE OK"));
    socket.on("error", (error) => settle(`FAILED -> ${describeError(error)}`));
    setTimeout(() => settle("TIMEOUT"), HANDSHAKE_TIMEOUT_MS);
  });

/** Neon's HTTP driver — no WebSocket involved at all. */
const httpQueryProbe = async (connectionString: string): Promise<Probe> => {
  const name = "neon() over HTTP";

  try {
    const sql = neon(connectionString);
    const rows = await sql`SELECT 1 AS ok`;

    return { name, outcome: `OK -> ${JSON.stringify(rows)}` };
  } catch (error) {
    return { name, outcome: `FAILED -> ${describeError(error)}` };
  }
};

/** Pool.query routed over fetch instead of the WebSocket. */
const pooledFetchProbe = async (connectionString: string): Promise<Probe> => {
  const name = "Pool.query with poolQueryViaFetch";
  const previous = neonConfig.poolQueryViaFetch;

  neonConfig.poolQueryViaFetch = true;
  const pool = new Pool({ connectionString });

  try {
    const result = await pool.query("SELECT 1 AS ok");

    return { name, outcome: `OK -> ${JSON.stringify(result.rows)}` };
  } catch (error) {
    return { name, outcome: `FAILED -> ${describeError(error)}` };
  } finally {
    neonConfig.poolQueryViaFetch = previous;
    await pool.end().catch(() => {
      /* already closed */
    });
  }
};

export const runNeonDiagnostics = async (): Promise<NeonDiagnostics> => {
  const connectionString = keys().DATABASE_URL;
  const { host } = new URL(connectionString);

  return {
    runtime: {
      node: process.version,
      vercelEnv: process.env.VERCEL_ENV,
      region: process.env.VERCEL_REGION,
      nativeWebSocket: Boolean(globalThis.WebSocket),
    },
    // Host only — never the credentials in the connection string.
    host,
    probes: [
      await rawUpgradeProbe(host),
      await wsHandshakeProbe(host),
      await httpQueryProbe(connectionString),
      await pooledFetchProbe(connectionString),
    ],
  };
};
