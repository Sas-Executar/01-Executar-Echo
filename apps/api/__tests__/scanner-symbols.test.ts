import { InsufficientRoleError } from "@repo/auth/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@repo/auth/server", async () => {
  const actual =
    await vi.importActual<typeof import("@repo/auth/server")>(
      "@repo/auth/server"
    );
  return { ...actual, requireRole: vi.fn() };
});
vi.mock("@repo/database", () => ({ database: {}, forWorkspace: vi.fn() }));
vi.mock("@repo/scanner/server", () => ({
  listEnabledSymbols: vi.fn(),
  registerSymbol: vi.fn(),
}));

const request = (body: unknown) =>
  new Request("http://localhost/scanner/symbols", {
    method: "POST",
    body: JSON.stringify(body),
  });

const validBody = {
  symbolId: "SYM-DONE-001",
  semantic: "DONE",
  command: "COMPLETE_LATEST_OPEN_TASK",
  embeddings: [[0.1, 0.2, 0.3]],
};

describe("POST /scanner/symbols", () => {
  beforeEach(() => vi.clearAllMocks());

  test("rejects a caller without at least MEMBER role", async () => {
    const { requireRole } = await import("@repo/auth/server");
    vi.mocked(requireRole).mockRejectedValueOnce(
      new InsufficientRoleError("MEMBER")
    );

    const { POST } = await import("../app/scanner/symbols/route");
    const response = await POST(request(validBody));

    expect(response.status).toBe(403);
  });

  test("rejects a malformed body — missing symbolId", async () => {
    const { requireRole } = await import("@repo/auth/server");
    vi.mocked(requireRole).mockResolvedValueOnce({
      workspace: { id: "workspace-1" } as any,
      membership: { clerkUserId: "user-1" } as any,
    });

    const { POST } = await import("../app/scanner/symbols/route");
    const { symbolId, ...withoutSymbolId } = validBody;
    const response = await POST(request(withoutSymbolId));

    expect(response.status).toBe(400);
  });

  test("rejects an empty embeddings array", async () => {
    const { requireRole } = await import("@repo/auth/server");
    vi.mocked(requireRole).mockResolvedValueOnce({
      workspace: { id: "workspace-1" } as any,
      membership: { clerkUserId: "user-1" } as any,
    });

    const { POST } = await import("../app/scanner/symbols/route");
    const response = await POST(request({ ...validBody, embeddings: [] }));

    expect(response.status).toBe(400);
  });

  test("enrolls a symbol and returns 201 with the registered row", async () => {
    const { requireRole } = await import("@repo/auth/server");
    const { registerSymbol } = await import("@repo/scanner/server");
    vi.mocked(requireRole).mockResolvedValueOnce({
      workspace: { id: "workspace-1" } as any,
      membership: { clerkUserId: "user-1" } as any,
    });
    vi.mocked(registerSymbol).mockResolvedValueOnce({
      id: "row-1",
      symbolId: "SYM-DONE-001",
      semantic: "DONE",
      command: "COMPLETE_LATEST_OPEN_TASK",
      embeddings: [new Float32Array([0.1, 0.2, 0.3])],
      enabled: true,
    });

    const { POST } = await import("../app/scanner/symbols/route");
    const response = await POST(request(validBody));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      symbol: {
        symbolId: "SYM-DONE-001",
        semantic: "DONE",
        command: "COMPLETE_LATEST_OPEN_TASK",
        enabled: true,
      },
    });
    expect(registerSymbol).toHaveBeenCalledWith("workspace-1", {
      symbolId: "SYM-DONE-001",
      semantic: "DONE",
      command: "COMPLETE_LATEST_OPEN_TASK",
      embeddings: [new Float32Array([0.1, 0.2, 0.3])],
    });
  });

  test("maps a registerSymbol error (e.g. inconsistent embedding dimensions) to 400", async () => {
    const { requireRole } = await import("@repo/auth/server");
    const { registerSymbol } = await import("@repo/scanner/server");
    vi.mocked(requireRole).mockResolvedValueOnce({
      workspace: { id: "workspace-1" } as any,
      membership: { clerkUserId: "user-1" } as any,
    });
    vi.mocked(registerSymbol).mockRejectedValueOnce(
      new Error("All embeddings for one symbol must share the same dimension.")
    );

    const { POST } = await import("../app/scanner/symbols/route");
    const response = await POST(
      request({
        ...validBody,
        embeddings: [
          [0.1, 0.2],
          [0.1, 0.2, 0.3],
        ],
      })
    );

    expect(response.status).toBe(400);
  });
});
