---
name: agentcore-operations
description: Review, release, troubleshoot or retire an AgentCore deployment using exact image/runtime identity, configuration ownership and scoped operational evidence. Use for deployment drift, stale secrets, readiness or cleanup; not for routine agent prompt development.
license: MIT
metadata:
  author: matthew-kissinger
  version: "0.1.0"
---

# Operate the version that is actually running

Establish deployment ownership and the requested operation first. Read-only review
is not a request to redeploy; existing explicit deployment approval need not be
requested again. Preserve the project's release and rollback process.

Read [configuration and release identity](references/config-and-release.md) for stale
settings and drift, or [retirement and recovery](references/retirement.md) for cleanup.

## Evidence to collect

- Source revision and isolated image-test result.
- Registry digest and deployed runtime version/endpoint binding.
- Configuration source and adoption time, without secret values.
- One check of the disputed live behavior, where authorized.
- Remaining uncertainty and the next observation that can resolve it.

Keep those evidence levels separate. A historical document, green source CI or a
mutable image tag cannot independently establish the deployed behavior.

Inspect only what resolves the current question. Reuse unchanged valid checks;
repeat a check when its inputs changed or a failure calls its result into question.
Stop retrying unchanged infrastructure after a repeated failure at the same boundary.

Do not export raw secrets, user data or invocation bodies into diagnostic artifacts.
Prepare exact changes before a mutation and retain rollback/recovery information
appropriate to the operation.
