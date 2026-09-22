/**
 * @repo/vera — the VERA agent (ADR-VERA-001).
 *
 * Two layers. The deterministic one (`respond`) retrieves and routes over
 * the cognitive map, the framework catalog and the Oficina's contracts;
 * it needs no model and is fully testable. The generative one adds prose
 * synthesis over that same grounded context and is off unless
 * `VERA_LLM_ENABLED` and a provider key are both present.
 *
 * VERA's authority never exceeds the registered capabilities, unlisted
 * capabilities are denied, and content retrieved from the corpus is data
 * — never instruction.
 */
export * from "./src/capabilities";
export * from "./src/envelope";
export * from "./src/intent";
export * from "./src/respond";
export * from "./src/generative";
