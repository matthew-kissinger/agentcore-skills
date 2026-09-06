# Configuration ownership and release identity

## A correct secret can lose to an old environment value

The field application hydrated configuration from Secrets Manager only when a value
was absent from the process environment. A CDK-supplied environment value therefore
shadowed the secret forever, even though the secret looked correct.

This was application precedence logic, not an automatic property of Secrets Manager
or every AgentCore runtime. Trace the actual loader before changing configuration.
For each setting record: source, precedence, refresh timing and owner. Keep cold-start
settings in one authoritative source where practical; report adoption by version or
safe presence metadata rather than logging values.

`PutSecretValue` writes a new secret value/version; it is not a JSON patch operation.
If a shared JSON document is the chosen design, preserve unrelated keys during an
authorized update. Read/merge/write is still vulnerable to concurrent writers: use
the project's coordination/version strategy and validate the full intended document.
Prefer a managed secret-editing path that does not expose values to agent context.

## Mutable names are not immutable releases

A template may name a tag while the runtime executes a resolved digest. Record both,
and use digest-qualified deployment inputs where supported. Bind the release receipt
to runtime version and endpoint, including the actual live version. Historical field
checks found a stable endpoint could omit a transition-only target version; do not
require that field after transition completion without checking current API semantics.

For coupled images, verify the exact combination being released. A later successful
test of one image does not retroactively validate an earlier mixed deployment.
After release, check health and one representative supported path. Do not report a
provider-free probe as model-quality or paid-provider validation.

## IAM that looks scoped can authorize nothing

Some actions do not support resource-level permissions. An ARN-scoped statement can
be well-formed yet grant no access. Look up the action in the current service
authorization reference, then test with the correct resource/context inputs. A
simulation is a policy diagnostic, not proof of every effective production policy.
SCPs, boundaries, resource policies and service dependencies can change the result.

Use a narrowly correlated access-denied event to identify the missing action. Avoid
adding broad permissions until the code happens to work. Paginate audit searches;
an incomplete page is not proof no call occurred.

## Sources

- [PutSecretValue API](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_PutSecretValue.html)
- [AgentCore Runtime versions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agent-runtime-versioning.html)
- [AWS service authorization reference](https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html)

Environment precedence and endpoint-transition observations originated in the
maintainer's retired service. Reproduce them before prescribing a historical fix.
