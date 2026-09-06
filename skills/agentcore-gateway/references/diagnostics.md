# Diagnose the hop, not the generic message

An upstream authorization failure can surface as a generic Gateway tool error.
Repeated retries then obscure the original cause. Establish whether the request
reached the target, and whether identity survived the route.

## Controlled comparison

Choose a read-only operation. Use the same caller and scopes directly and through
Gateway in a narrow time window. Record status, error type, target/version and safe
correlation metadata. Do not copy tokens into logs, tickets or command history.

| Evidence | What it supports | What it does not establish |
| --- | --- | --- |
| Direct succeeds; Gateway fails | Difference along the Gateway path | Which header or policy failed |
| Target access log shows that request with 401 | The hop reached an upstream verifier | Whether expiry, scope, audience or propagation caused rejection |
| Load balancer 4XX count rises | Some requests were rejected in that window | Attribution to this call without correlation |
| No application audit row | No observed post-auth audit event | Proof that auth failed; logging or a different path may explain absence |
| Interceptor failure log | That invocation failed in the interceptor | Target behavior after other successful invocations |
| Missing log group | Logs were not found there | Proof the interceptor never ran; check region, permissions and logging setup |

This deliberately narrows an older runbook's claims. Aggregate metrics and missing
rows are clues; they are not unique explanations.

## Minimal matrix

Check valid caller, expired/invalid token, missing forwarded header, disallowed scope,
and conflicting credential sources. Keep payload and destination constant. Validate
the emitted header name, target allowlist and verifier configuration together.

When changing infrastructure, inspect the synthesized target properties and the
deployed target revision. A successful local schema test does not prove that the
service accepted the credential shape or forwarded the header.

Use [Gateway troubleshooting](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-debug.html)
for service errors and current diagnostics. The contract example is intentionally
offline; it does not substitute for an authorized end-to-end hop check.
