# Security policy

Report vulnerabilities privately through GitHub Security Advisories. Do not include credentials or traveler data in public issues.

## Deployment credentials

The WordPress synchronization credential must be provisioned as `SJ_SYNC_TOKEN` (a Cloudflare Worker secret binding or a Python environment variable). Without it the server must not publish routes. No secret should be placed in source, client arguments, logs, or test fixtures. Rotate the legacy synchronization credential previously committed to repository history before deploying this change; removing it from the current tree does not revoke it. Update the WordPress receiver and the secret binding together.

Tests mock external services and do not publish real travel routes. Read-only discovery and local tools require no publishing credential.

## Verification limits

CI validates both implementations, malformed HTTP JSON-RPC requests and a real Python stdio MCP handshake. This is not a penetration test, a production deployment or a guarantee of any third-party trust score. M8ven reputation and adoption are outside this repository's control.
