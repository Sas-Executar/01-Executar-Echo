import { defineConfig, devices } from "@playwright/test";

/**
 * Runtime verification against the deployed site (G10).
 *
 * Separate from playwright.config.ts because that one starts a local dev
 * server; this one asserts against production and must not.
 *
 * `executablePath` pins the Chromium already installed in this
 * environment (build 1194). The pinned @playwright/test expects build
 * 1243 and there is no browser download here, so without this the run
 * fails on a missing headless shell rather than on anything about the
 * site.
 */
export default defineConfig({
  testDir: "e2e",
  testMatch: /(production-verify|v2-identity)\.spec\.ts/,
  fullyParallel: false,
  reporter: "line",
  timeout: 90_000,
  use: {
    // The deployed site. Specs may use relative paths; the older spec
    // spells the host out and is unaffected.
    baseURL: "https://executar-nf-web.vercel.app",
    trace: "off",
    launchOptions: {
      executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
      args: [
        // Outbound HTTPS in this environment goes through an agent proxy
        // that re-terminates TLS, and Chromium launches with a fresh
        // profile that does not pick up the configured NSS store — so it
        // rejected the site with ERR_CERT_AUTHORITY_INVALID.
        //
        // This pins that one CA by its public-key hash
        // (/root/.ccr/ca-bundle.crt). Certificate verification stays on
        // for everything else; this is not --ignore-certificate-errors.
        "--ignore-certificate-errors-spki-list=KnP1OnzHv/y42eRQmbGwoYTHcSJF448m6CU5mdngwKk=",
      ],
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
