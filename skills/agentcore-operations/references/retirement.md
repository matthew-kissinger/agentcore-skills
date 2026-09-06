# Retire with a recoverable record

The service lifecycle is a useful source of operational lessons even after the
service is gone. Retirement also tests whether data ownership and release identity
were documented accurately.

## Before an authorized teardown

Inventory runtime versions/endpoints, stacks, network dependencies, registries,
durable data and independently deployed services. Review retention policies. Preserve
the recovery artifacts the owner actually needs: source/bundles, configuration
metadata, schema/data exports and deployment coordinates. Verify representative
restoration or at least export completeness; a copy command's exit code alone may
miss encoding or pagination problems.

Keep credentials and customer data out of public handoff packets. A skill extracted
from an incident should carry the decision and a synthetic example, not the archive.

## Deletion is asynchronous

An accepted deletion is not confirmed absence. Follow documented dependencies and
poll boundedly for terminal state. The historical AgentCore teardown had named
endpoints still deleting; the default endpoint was tied to runtime deletion rather
than independently removable. Verify current API behavior before encoding that order
into automation.

Distinguish these outcomes in the record:

- Requested deletion.
- Confirmed absence.
- Intentionally retained resource and its owner/cost.
- Incomplete or failed cleanup and the next check.

Reconcile retained VPC endpoints, storage, logs and other billable resources after
the compute layer is gone. Use cost data with its reporting delay in mind. Do not
declare zero ongoing cost from a missing runtime alone.

## Sources

- [DeleteAgentRuntime API](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_DeleteAgentRuntime.html)
- [DeleteAgentRuntimeEndpoint API](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_DeleteAgentRuntimeEndpoint.html)

This case derives from a retired maintainer-owned application. Its original record
ended with some cleanup verification outstanding, so these skills do not claim that
the record proves complete teardown.
