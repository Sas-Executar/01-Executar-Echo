import "server-only";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "./generated/client";
import { keys } from "./keys";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// /cron/keep-alive and /cron/routines returned 500 in production with
// "Error: Unexpected server response: 101". 101 is the *success* status
// for a WebSocket handshake, and `ws` emits that message when Node hands
// it a `response` event where it expected `upgrade`.
//
// Measured from inside the Lambda against the real pooler host, same
// runtime and same moment (see packages/database/diagnostics.ts):
//
//     node v24.3.0, nativeWebSocket: true
//     raw https upgrade  -> RESPONSE event, statusCode 101, with
//                           connection: upgrade, upgrade: websocket and
//                           a correct sec-websocket-accept
//     ws handshake       -> FAILED, "Unexpected server response: 101"
//     native WebSocket   -> HANDSHAKE OK
//     Pool.query native  -> OK
//
// Neon's response is a valid upgrade — nothing strips or rewrites it.
// Node 24 simply does not surface it as one, so `ws`, which listens for
// the `upgrade` event, never sees it. The same handshake succeeds on
// Node 22, which is why this never reproduced locally.
//
// The platform's own WebSocket does not go through Node's http upgrade
// path and completes the handshake. It is preferred over poolQueryViaFetch
// because it still supports sessions and interactive transactions, which
// rls.ts needs for its $transaction and which the fetch route cannot
// serve. `ws` stays as the fallback for runtimes with no global
// WebSocket.
neonConfig.webSocketConstructor = (globalThis.WebSocket ??
  ws) as typeof neonConfig.webSocketConstructor;

const adapter = new PrismaNeon({ connectionString: keys().DATABASE_URL });

export const database = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = database;
}

export * from "./generated/client";
export * from "./rls";
