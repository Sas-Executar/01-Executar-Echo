import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * A Clerk publishable key carries its instance's Frontend API host as
 * base64 after the `pk_test_`/`pk_live_` prefix, terminated by `$`. A
 * placeholder key encodes an empty instance — `pk_live_LmNsZXJrLmFjY291bnRzLmRldiQ`
 * decodes to `.clerk.accounts.dev$`, leading with the dot where the
 * instance name belongs. Checking only `startsWith("pk_")` accepted that,
 * and it reached production: `/` redirected signed-out users to
 * `https://.accounts.dev/sign-in`, a host that does not resolve, so nobody
 * could sign in. Decode and require a non-empty first label.
 */
const CLERK_KEY_PREFIX = /^pk_(test|live)_/;
const TRAILING_DOLLAR = /\$$/;

export const hasResolvableClerkHost = (key: string): boolean => {
  const encoded = key.replace(CLERK_KEY_PREFIX, "");

  if (encoded === key) {
    return false;
  }

  let host: string;
  try {
    host = atob(encoded);
  } catch {
    return false;
  }

  const [firstLabel, ...rest] = host.replace(TRAILING_DOLLAR, "").split(".");

  return firstLabel.length > 0 && rest.length > 0;
};

export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      CLERK_SECRET_KEY: z.string().startsWith("sk_").optional(),
      CLERK_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
    },
    client: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
        .string()
        .startsWith("pk_")
        .refine(hasResolvableClerkHost, {
          message:
            "Clerk publishable key encodes an empty/placeholder Frontend API host — sign-in would redirect to a host that does not resolve. Use the real key from the Clerk dashboard.",
        })
        .optional(),
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().startsWith("/").optional(),
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().startsWith("/").optional(),
      NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z
        .string()
        .startsWith("/")
        .optional(),
      NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z
        .string()
        .startsWith("/")
        .optional(),
    },
    runtimeEnv: {
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
      NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
      NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    },
  });
