import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { test } from "node:test";

const root = resolve(import.meta.dirname, "..");

function fixture() {
  const cwd = mkdtempSync(`${tmpdir()}/deployment-check-`);
  for (const path of ["config", "apps/mobile/app.json"]) {
    cpSync(resolve(root, path), resolve(cwd, path), { recursive: true });
  }
  return cwd;
}

function run(mode, overrides = {}, cwd = fixture()) {
  const env = {
    PATH: process.env.PATH,
    GITHUB_ENV: `${cwd}/env`,
    GITHUB_OUTPUT: `${cwd}/output`,
    GITHUB_STEP_SUMMARY: `${cwd}/summary`,
    GITHUB_EVENT_NAME: "workflow_dispatch",
    ...overrides,
  };
  const result = spawnSync(
    "bash",
    [resolve(root, "scripts/load-deployment-config.sh"), mode],
    { cwd, env, encoding: "utf8" }
  );
  return { ...result, cwd };
}

test("manual web dispatch fails with missing secret names only", () => {
  const result = run("web");
  assert.equal(result.status, 1);
  assert.ok(result.stdout.includes("VERCEL_TOKEN DATABASE_URL"));
});

test("unconfigured push records blocked status without deploying", () => {
  const result = run("web", { GITHUB_EVENT_NAME: "push" });
  assert.equal(result.status, 0);
  assert.equal(readFileSync(`${result.cwd}/output`, "utf8"), "ready=false\n");
  assert.ok(readFileSync(`${result.cwd}/summary`, "utf8").includes("BLOCKED"));
});

test("configured web resolves versioned project and does not export secrets", () => {
  const result = run("web", {
    VERCEL_TOKEN: "test-token-do-not-log",
    DATABASE_URL: "test-db-do-not-log",
    DEPLOY_APP: "api",
  });
  assert.equal(result.status, 0);
  const output = readFileSync(`${result.cwd}/env`, "utf8");
  assert.ok(
    output.includes("VERCEL_PROJECT_ID=prj_Ui40tk9orjhk5wq5tG90F5z65kiD")
  );
  assert.ok(!(output + result.stdout).includes("do-not-log"));
});

test("mobile is blocked even with a token when app.json is unlinked", () => {
  const cwd = fixture();
  const path = `${cwd}/apps/mobile/app.json`;
  const app = JSON.parse(readFileSync(path, "utf8"));
  app.expo.extra.eas.projectId = "";
  writeFileSync(path, JSON.stringify(app));
  const result = run("mobile", { EXPO_TOKEN: "test-only" }, cwd);
  assert.equal(result.status, 1);
  assert.ok(result.stdout.includes("expo.extra.eas.projectId"));
});

test("native build needs linkage; OTA additionally needs updates configuration", () => {
  const cwd = fixture();
  const path = `${cwd}/apps/mobile/app.json`;
  const app = JSON.parse(readFileSync(path, "utf8"));
  app.expo.extra.eas.projectId = "11111111-1111-4111-8111-111111111111";
  writeFileSync(path, JSON.stringify(app));
  assert.equal(
    run("mobile", { EXPO_TOKEN: "test", MOBILE_ACTION: "build" }, cwd).status,
    0
  );
  assert.equal(run("mobile", { EXPO_TOKEN: "test" }, cwd).status, 1);
  app.expo.updates = {
    url: `https://u.expo.dev/${app.expo.extra.eas.projectId}`,
  };
  app.expo.runtimeVersion = { policy: "appVersion" };
  writeFileSync(path, JSON.stringify(app));
  assert.equal(run("mobile", { EXPO_TOKEN: "test" }, cwd).status, 0);
});

test("sync rejects no-op requests and incomplete email configuration", () => {
  assert.equal(run("sync", { VERCEL_TOKEN: "test" }).status, 1);
  assert.equal(
    run("sync", { VERCEL_TOKEN: "test", RESEND_TOKEN_VALUE: "test" }).status,
    1
  );
  assert.equal(
    run("sync", { VERCEL_TOKEN: "test", CLERK_WEBHOOK_SECRET_VALUE: "test" })
      .status,
    0
  );
});

test("sync upserts changed values even when targets would be unchanged", () => {
  const cwd = fixture();
  const mock = `${cwd}/curl`;
  writeFileSync(mock, '#!/bin/sh\ncat >> "$CAPTURE"\nprintf "200"\n', {
    mode: 0o700,
  });
  for (const value of ["old-test-value", "new-test-value"]) {
    const result = spawnSync(
      "bash",
      [resolve(root, "scripts/sync-vercel-env.sh")],
      {
        encoding: "utf8",
        env: {
          PATH: `${cwd}:${process.env.PATH}`,
          CAPTURE: `${cwd}/requests`,
          VERCEL_TOKEN: "test-token",
          VERCEL_TEAM_ID: "team_test",
          PROJECT_ID: "prj_test",
          ENV_KEY: "TEST_SECRET",
          ENV_VALUE: value,
          ENV_TARGETS: "production",
        },
      }
    );
    assert.equal(result.status, 0, result.stderr);
    assert.ok(!(result.stdout + result.stderr).includes("test-value"));
  }
  const requests = readFileSync(`${cwd}/requests`, "utf8");
  assert.ok(requests.includes("old-test-value"));
  assert.ok(requests.includes("new-test-value"));
});

test("health check rejects 401, redirects and 500; accepts 200", () => {
  const cwd = fixture();
  writeFileSync(`${cwd}/curl`, '#!/bin/sh\nprintf "%s" "$STATUS"\n', {
    mode: 0o700,
  });
  for (const status of ["200", "302", "401", "500"]) {
    const result = spawnSync(
      "bash",
      [resolve(root, "scripts/check-deployment-health.sh")],
      {
        env: {
          PATH: `${cwd}:${process.env.PATH}`,
          STATUS: status,
          DEPLOYMENT_URL: "https://example.invalid",
          HEALTH_PATH: "/health",
        },
      }
    );
    assert.equal(result.status, status === "200" ? 0 : 1);
  }
});
