#!/usr/bin/env node
// Proves a deployed Clerk webhook endpoint actually verifies signatures
// with the CLERK_WEBHOOK_SECRET currently configured — not just that
// the string happens to start with "whsec_" (that prefix alone is not
// proof the value is real or correctly paired with the endpoint; Clerk
// mints a fresh, unrelated secret per webhook endpoint).
//
// Builds a real Svix-signed test request the same way Clerk's own
// webhook sender does (HMAC-SHA256 over "{id}.{timestamp}.{body}",
// keyed by the base64-decoded secret after stripping "whsec_"), then
// POSTs it to the live endpoint and reads the endpoint's own verdict:
//
//   201 "User updated"  -> svix.verify() accepted the signature; the
//                          secret matches what's configured server-side.
//   400 "Error occured" -> verification failed (wrong/mismatched secret).
//   200 {"ok":false}    -> CLERK_WEBHOOK_SECRET isn't set at all on the
//                          deployment being tested.
//   anything else       -> unexpected; treated as inconclusive, not pass.
//
// This never asserts the secret is "the right one for Clerk" beyond
// what's observable from the outside: that the deployed endpoint's own
// verification logic accepts a payload signed with the value the caller
// supplied. It does not, and cannot, confirm Clerk's dashboard has the
// same value configured for its webhook — only a real delivery from
// Clerk (or checking its dashboard) proves that side.
//
// Usage:
//   CLERK_WEBHOOK_SECRET=whsec_... TARGET_URL=https://.../webhooks/auth \
//     node scripts/verify-clerk-webhook-signature.mjs
//
// Exit codes: 0 = signature accepted, 1 = usage error, 2 = rejected or
// inconclusive (see stderr for which).

import { createHmac } from "node:crypto";

const secret = process.env.CLERK_WEBHOOK_SECRET;
const targetUrl = process.env.TARGET_URL;

if (!secret || !targetUrl) {
  console.error(
    "usage: CLERK_WEBHOOK_SECRET=... TARGET_URL=... node verify-clerk-webhook-signature.mjs"
  );
  process.exit(1);
}

if (!secret.startsWith("whsec_")) {
  console.error(
    `::warning::CLERK_WEBHOOK_SECRET does not start with "whsec_" — ` +
      "sending the test anyway (the prefix is not what's being proven " +
      "here), but this will almost certainly fail signature verification."
  );
}

const payload = {
  type: "user.updated",
  data: {
    id: "user_synthetic_signature_check",
    email_addresses: [],
    phone_numbers: [],
    first_name: "Signature",
    last_name: "Check",
    image_url: "",
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  object: "event",
};

const body = JSON.stringify(payload);
const svixId = `msg_synthetic_${Date.now()}`;
const svixTimestamp = Math.floor(Date.now() / 1000).toString();

// Svix secrets are "whsec_" + base64(key bytes).
const keyBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
const signedContent = `${svixId}.${svixTimestamp}.${body}`;
const signature = createHmac("sha256", keyBytes)
  .update(signedContent)
  .digest("base64");

const res = await fetch(targetUrl, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": `v1,${signature}`,
  },
  body,
});

const text = await res.text();

if (res.status === 201) {
  console.log(
    `PASS: ${targetUrl} accepted a signature built from the configured ` +
      "secret (HTTP 201). CLERK_WEBHOOK_SECRET is correctly wired end-to-end."
  );
  process.exit(0);
}

if (res.status === 200 && /"ok":false/.test(text)) {
  console.error(
    `FAIL: ${targetUrl} reports CLERK_WEBHOOK_SECRET is not configured ` +
      "on this deployment (env var absent), despite one being supplied to this check."
  );
  process.exit(2);
}

if (res.status === 400) {
  console.error(
    `FAIL: ${targetUrl} rejected the signature (HTTP 400) — the secret ` +
      "this check used does not verify against this endpoint. Either the " +
      "Vercel env var and Clerk's dashboard value are out of sync, or the " +
      "value is malformed."
  );
  process.exit(2);
}

console.error(
  `INCONCLUSIVE: unexpected response HTTP ${res.status}: ${text.slice(0, 300)}`
);
process.exit(2);
