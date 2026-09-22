import { loadCognitiveMap } from "@repo/knowledge/server";
import { respond } from "@repo/vera";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * VERA's endpoint.
 *
 * The request body is parsed through a schema and the question is length
 * -bounded: the text is a user-supplied string that VERA treats strictly
 * as data, and nothing in it reaches an interpreter. `route` is echoed
 * into the envelope for grounding, so it is constrained to a local path
 * rather than accepted as an arbitrary string.
 */
const requestSchema = z.object({
  question: z.string().min(1).max(2000),
  route: z
    .string()
    .max(512)
    .regex(/^\//, "route must be a local path")
    .default("/vera"),
});

export const POST = async (request: NextRequest) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const envelope = respond({
    question: parsed.data.question,
    route: parsed.data.route,
    map: loadCognitiveMap(),
  });

  return NextResponse.json(envelope);
};
