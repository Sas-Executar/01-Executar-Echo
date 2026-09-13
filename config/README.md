# Deployment configuration

`deployment.json` is the shared, non-secret identity configuration for
`deploy-web.yml`, `deploy-mobile.yml` and `sync-vercel-env.yml`. Vercel IDs
were checked through the connected Vercel API. They are identifiers, not
credentials. The mobile project ID remains in `apps/mobile/app.json`;
an empty value is a real unresolved EAS linkage, never a placeholder UUID.

`scripts/load-deployment-config.sh` loads the selected project's IDs into
the job environment and checks required credentials without emitting them.
The existing names `VERCEL_TOKEN`, `DATABASE_URL`, `EXPO_TOKEN` and the
application sync secrets remain unchanged. Repository variables for org/project
IDs and `EAS_PROJECT_CONFIGURED` are no longer required. Secrets currently
residing in GitHub Environments require the corresponding job environment
association; this change does not invent an environment or bypass its rules.

On automatic pushes, missing prerequisites produce a BLOCKED summary and
prevent deployment. Explicit workflow dispatch fails if prerequisites are
missing. Presence checks do not prove provider authentication. A queued EAS
build does not mean it completed. Native builds require a linked project;
OTA additionally requires a matching updates URL and runtime version.
Manual store submission does not also publish an OTA update.

The sync script always upserts supplied values. Encrypted metadata cannot
prove a value is current; identical target lists must not prevent rotation.
It suppresses response bodies and reports HTTP status on provider errors.
An absent Clerk sync secret leaves the value configured directly in Vercel
untouched. Existing sync target scopes are preserved; review them before
supplying a database credential intended for a different environment.

Smoke checks accept only 2xx and do not follow redirects. A deployment
protected by login will fail explicitly rather than masquerade as healthy.
The signed Clerk self-test proves only agreement with the deployed secret;
provider configuration requires a real Clerk delivery.

Verification: `node --test scripts/deployment-config.test.mjs` and shell
syntax validation. The tests mock provider traffic and use synthetic values.
They are not evidence of a successful deployment or webhook delivery.

Traceability: `DEVOPS-002`, `DEVOPS-003`, `DEVOPS-004` in
`Sas-Executar/04-exe-pre-Blueprint/docs/14-devops` were consulted. They are
draft templates, not claims of approved or completed production behavior.
