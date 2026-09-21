import {
  InsufficientRoleError,
  NoActiveOrganizationError,
  requireRole,
  WorkspaceNotFoundError,
} from "@repo/auth/server";
import { visualSymbolEnrollmentRequestSchema } from "@repo/scanner";
import { listEnabledSymbols, registerSymbol } from "@repo/scanner/server";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Shared by GET and POST: resolves the caller's workspace, mapping the
 * same auth failures both handlers can hit onto the same status codes —
 * kept in one place so the two routes' error handling can't drift apart.
 * Returns the workspaceId on success, or a Response to return as-is on
 * failure (the caller does `if (typeof resolved !== "string") return
 * resolved;`).
 */
const resolveWorkspaceId = async (): Promise<string | Response> => {
  try {
    const { workspace } = await requireRole("MEMBER");
    return workspace.id;
  } catch (error) {
    if (
      error instanceof NoActiveOrganizationError ||
      error instanceof WorkspaceNotFoundError
    ) {
      return new Response("No active workspace", { status: 409 });
    }
    if (error instanceof InsufficientRoleError) {
      return new Response("Forbidden", { status: 403 });
    }
    throw error;
  }
};

/**
 * Returns this workspace's enabled VisualSymbol registry (REQ-SCAN-003
 * "manter registry local de símbolos e embeddings" — apps/mobile's own
 * on-device cache syncs from this). Embeddings serialize as plain
 * number[][] over JSON (Float32Array isn't directly JSON-transportable)
 * — a few hundred floats per reference image, trivial payload size.
 */
export const GET = async (): Promise<Response> => {
  const resolved = await resolveWorkspaceId();
  if (typeof resolved !== "string") {
    return resolved;
  }
  const workspaceId = resolved;

  const symbols = await listEnabledSymbols(workspaceId);

  return NextResponse.json({
    symbols: symbols.map((symbol) => ({
      symbolId: symbol.symbolId,
      semantic: symbol.semantic,
      command: symbol.command,
      enabled: symbol.enabled,
      embeddings: symbol.embeddings.map((e) => Array.from(e)),
    })),
  });
};

/**
 * Enrolls a new symbol (REQ-SCAN-004) or re-enrolls (replaces the
 * embeddings of) an existing one — registerSymbol() itself upserts on
 * [workspaceId, symbolId], so this route doesn't need to distinguish the
 * two cases. The mobile client captures 1+ reference frames, runs them
 * through the same on-device encodeFrame() used for recognition, and
 * posts the resulting embeddings here — this route never touches an
 * image or the ONNX runtime, only the already-computed vectors.
 */
export const POST = async (request: Request): Promise<Response> => {
  const resolved = await resolveWorkspaceId();
  if (typeof resolved !== "string") {
    return resolved;
  }
  const workspaceId = resolved;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = visualSymbolEnrollmentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: z.treeifyError(parsed.error) },
      { status: 400 }
    );
  }

  const { symbolId, semantic, command, embeddings } = parsed.data;

  let symbol: Awaited<ReturnType<typeof registerSymbol>>;
  try {
    symbol = await registerSymbol(workspaceId, {
      symbolId,
      semantic,
      command,
      embeddings: embeddings.map((e) => new Float32Array(e)),
    });
  } catch (error) {
    // EmptyEmbeddingListError / InconsistentEmbeddingDimensionError from
    // encodeEmbeddings() — the zod schema above only checks each
    // embedding is a non-empty finite-number array, not that every
    // embedding in the request shares the same length.
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      symbol: {
        symbolId: symbol.symbolId,
        semantic: symbol.semantic,
        command: symbol.command,
        enabled: symbol.enabled,
      },
    },
    { status: 201 }
  );
};
