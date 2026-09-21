import { visualCommandSchema, visualSymbolSemanticSchema } from "@repo/schemas";
import { z } from "zod";

/**
 * Shared between apps/api's POST /scanner/symbols route and apps/mobile's
 * enrollment client (visual-symbols.ts), so the two sides of the network
 * boundary can't silently drift into two different shapes for the same
 * request. Deliberately does not hardcode an exact embedding dimension
 * (e.g. DINOv2 ViT-S/14's own 384) — matches this package's existing
 * convention (packages/scanner/src/preprocess.ts's own comment: "the
 * actual required input shape depends on whichever concrete ONNX export...
 * not hardcoded") of treating the model's output width as a runtime fact,
 * not a compile-time constant. Real consistency checking (every embedding
 * for one symbol sharing the same dimension) already happens in
 * embedding-codec.ts's encodeEmbeddings() — this schema only rejects
 * structurally malformed payloads (missing fields, empty arrays,
 * non-finite numbers) before they reach that far.
 */
export const visualSymbolEnrollmentRequestSchema = z.object({
  symbolId: z.string().min(1),
  semantic: visualSymbolSemanticSchema,
  command: visualCommandSchema,
  embeddings: z
    .array(z.array(z.number().finite()).min(1))
    .min(1, "At least one reference embedding is required."),
});

export type VisualSymbolEnrollmentRequest = z.infer<
  typeof visualSymbolEnrollmentRequestSchema
>;
