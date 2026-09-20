import { describe, expect, test } from "vitest";
import { hasResolvableClerkHost } from "../keys";

/**
 * Regression for the key that actually shipped to production: it passed
 * the old `startsWith("pk_")` check, encoded an empty instance, and left
 * signed-out users redirecting to `https://.accounts.dev/sign-in` — a
 * host that does not resolve, so sign-in was impossible.
 */
describe("hasResolvableClerkHost", () => {
  test("rejects the placeholder key that reached production", () => {
    // decodes to ".clerk.accounts.dev$" — no instance before the dot
    expect(hasResolvableClerkHost("pk_live_LmNsZXJrLmFjY291bnRzLmRldiQ")).toBe(
      false
    );
  });

  test("accepts a key carrying a real instance host", () => {
    const encoded = btoa("shining-lacewing-1173.clerk.accounts.dev$");

    expect(hasResolvableClerkHost(`pk_live_${encoded}`)).toBe(true);
    expect(hasResolvableClerkHost(`pk_test_${encoded}`)).toBe(true);
  });

  test("accepts a custom Frontend API domain", () => {
    const encoded = btoa("clerk.executar.app$");

    expect(hasResolvableClerkHost(`pk_live_${encoded}`)).toBe(true);
  });

  test("rejects a host with no dot at all", () => {
    expect(hasResolvableClerkHost(`pk_live_${btoa("localhost$")}`)).toBe(false);
  });

  test("rejects a key without the pk_test_/pk_live_ prefix", () => {
    expect(hasResolvableClerkHost("pk_bogus_abc")).toBe(false);
  });

  test("rejects payloads that are not valid base64", () => {
    expect(hasResolvableClerkHost("pk_live_!!!not-base64!!!")).toBe(false);
  });
});
