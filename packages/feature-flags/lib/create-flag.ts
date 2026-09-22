import { analytics } from "@repo/analytics/server";
import { auth } from "@repo/auth/server";
import { flag } from "flags/next";

/**
 * Resolves the current user id, or null when there isn't one.
 *
 * `auth()` does not merely return "signed out" when Clerk is
 * unconfigured — it throws. Since `decide()` runs during page render, an
 * absent or rotated Clerk key turned every flag evaluation into a 500 on
 * every route that reads a flag, including apps/web's root layout, which
 * renders no authenticated UI at all.
 *
 * A feature flag should never be able to take a page down: the worst
 * outcome of not knowing who the visitor is should be falling back to the
 * flag's default value, which is exactly what the signed-out path already
 * does.
 */
const getUserId = async (): Promise<string | null> => {
  try {
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
};

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const userId = await getUserId();

      if (!userId) {
        return this.defaultValue as boolean;
      }

      if (!analytics) {
        return this.defaultValue as boolean;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, userId);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
