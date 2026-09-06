---
name: agentcore-gateway
description: Configure or diagnose Amazon Bedrock AgentCore Gateway target authentication, JWT caller propagation, request interceptors and opaque upstream errors. Use when a direct API works but Gateway fails, or when mapping inbound identity to outbound target credentials.
license: MIT
metadata:
  author: matthew-kissinger
  version: "0.1.0"
---

# Trace identity across the Gateway hop

Identify the target type, inbound authorizer, outbound credential provider,
interceptor and upstream verifier. These are separate decisions. Preserve the
user's existing identity model; a shared service credential is not automatically
a replacement for per-caller authorization.

Read [identity propagation](references/identity-propagation.md) for header/signing
boundaries and [diagnosing failures](references/diagnostics.md) for controlled hop tests.

## Workflow

1. Draw the actual route: caller → Gateway → interceptor/signing → target → verifier.
   Record who validates each credential and which identity the target authorizes.
2. Check current target-specific credential support and the rendered IaC shape.
   Do not transfer an OpenAPI workaround to an HTTP, Lambda or MCP target blindly.
3. Trace header names through emission, allowlisting, signing and consumption.
   Never print token values to prove propagation.
4. Test the same scoped caller directly and through Gateway using a non-mutating
   operation. Keep the operation, token scope and time window equivalent.
5. Verify absent, invalid and conflicting credentials fail as intended. Report the
   boundary isolated by evidence, not a guessed cause from a generic error string.

[The offline header test](scripts/header-contract.mjs) models one historical
SigV4-plus-forwarded-bearer design. It checks a contract, not live AWS signing or JWT
cryptography. Deployment changes remain subject to the user's authorized scope.
