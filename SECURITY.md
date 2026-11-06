# Security policy

Report vulnerabilities privately through GitHub Security Advisories. Do not include credentials or traveler data in public issues.

## Deployment credentials

The WordPress synchronization credential may be provisioned as `SPACE_JOURNEY_SYNC_TOKEN` (or legacy alias `SJ_SYNC_TOKEN`) as a Cloudflare Worker secret binding or a Python environment variable. It is strictly pinned and only transmitted over TLS to the first-party endpoint `https://spacejourney.app/wp-json/sj/v1/sync-trip`.

Without this credential, the server fails closed and does not publish routes. No secret should ever be placed in source code, client arguments, logs, or test fixtures. Rotate synchronization credentials before production deployment.

## Verification & Rate Limiting

- **Zero-Trust Network Pinning**: External network calls are strictly restricted to verified first-party endpoints (`spacejourney.app`) and trusted public CDNs/APIs.
- **Rate Limiting**: Built-in sliding-window rate limiting (120 requests/minute per IP) with standard `RateLimit-*` and `X-RateLimit-*` response headers.
- **Test Integrity**: Test suites run completely offline with mocked networks and do not reach live endpoints.
- **MCP Protocol Conformance**: 100% compliant with the MCP 2024-11-05 Streamable HTTP and stdio specifications, with full annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) across all tools.
