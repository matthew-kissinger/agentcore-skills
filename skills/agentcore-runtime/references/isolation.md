# Prove isolation where code actually executes

A generated-code evaluator initially attempted same-container Linux namespace
isolation. Image builds and emulated checks did not establish target-kernel behavior.
Repeated real-kernel attempts stopped at the wrapper boundary. The architecture then
moved evaluation into a separate runtime with a restricted role and network.

The reusable lesson is not that a particular sandbox never works on AgentCore. It is
that an emulator, a container process and a managed microVM prove different things.

## Match the boundary to the threat

1. Identify the code and data under attacker/model control.
2. Identify credentials, filesystem, network destinations and host APIs it could reach.
3. Select a supported isolation mechanism for that threat. Managed Code Interpreter
   may fit; a separate evaluator runtime is another option when requirements justify it.
4. Test the exact deployed environment with a harmless, provider-free probe. Bind the
   receipt to image digest, runtime version and configuration.
5. Verify denial behavior and resource cleanup, not merely successful arithmetic.

If an isolated path is required, do not fall back to a credential-bearing local
subprocess when readiness fails. Return the failure at the boundary that broke.
Separate execution identities, restricted egress and a narrow input/output protocol
matter more than a function being named `sandbox`.

The historical evaluator used a secret-free role and an internetless VPC. That is
one implementation, not a requirement for every AgentCore application. A VPC still
requires analysis of endpoints, policies and reachable services; “no NAT” alone is
not complete isolation evidence.

## Keep probes small

Use one bounded probe for the disputed property. After repeated failures at the
same boundary, change the experiment or implementation rather than recreating the
same infrastructure indefinitely. A successful image build need not be rerun when
only an unrelated IAM grant changed, unless the project's release contract requires it.

## Sources and limits

- [Runtime security](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-security-best-practices.html)
- [Code Interpreter](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html)

The namespace-to-evaluator history comes from the maintainer's private release and
canary records. It is a historical case study, not a current AWS platform limitation
or a portable exploit demonstration.
