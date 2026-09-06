# Inbound identity and outbound credentials

## Ask who verifies what

Gateway can authenticate the caller and independently authenticate to its target.
A target credential does not necessarily represent the end user. If the target must
authorize each caller, preserve a verified caller identity rather than treating a
Gateway service credential as sufficient evidence of that caller's permissions.

The historical service used a custom JWT authorizer, an OpenAPI target and a request
interceptor. Its CloudFormation path required an outbound credential configuration
even when the downstream application relied on forwarded bearer validation. A
gateway-role SigV4 configuration satisfied that path, but the application did not
verify the SigV4 signature. The signature therefore supplied no application identity.

This is a dated deployment observation, not a universal recommendation. AWS target
types and credential modes evolve. Check the current API and CloudFormation resource
schema before reproducing the workaround. A different target or supported passthrough
mode may eliminate it.

Check protocol support at each hop as well. A new MCP specification or client release
is not evidence that the managed Gateway currently accepts that protocol revision.
Test the negotiated/wire behavior of the deployed service before upgrading every
component together; preserve a compatible adapter where necessary.

## A header can be overwritten after your interceptor

In that configuration, outbound SigV4 signing replaced `Authorization`, overwriting
the interceptor's caller bearer. A dedicated forwarded-bearer header avoided that
collision, but only after the target metadata allowlisted it.

Three independently maintained pieces had to agree:

| Boundary | Required agreement |
| --- | --- |
| Interceptor | Emit the intended caller credential after validating the input |
| Target configuration | Permit that exact forwarded header |
| Upstream verifier | Read the intended bearer and verify signature, issuer, audience, expiry and scope |

The custom header itself is not trusted. It must never carry an unverified identity
claim that the application accepts on sight. Strip/overwrite attacker-supplied copies
where appropriate, validate the credential at the receiving boundary and handle
conflicting credential sources explicitly.

Do not implement “try the forwarded token if any Authorization fails.” An invalid
primary bearer should not quietly downgrade to another credential. Define precedence
for bearer versus SigV4 syntax and reject ambiguous input. The offline example uses
a stricter policy that rejects any primary bearer plus a forwarded credential.

## Configuration choices to recheck

Compare credential support for the *actual* target and inbound authorizer. In the
historical path, IAM signing required a service field for the OpenAPI target while
other target types had different shapes. A convenient CDK helper did not render the
needed shape, so the synthesized output—not its class name—was the useful evidence.

Avoid a universal credential table frozen to that release. Consult:

- [Gateway outbound authorization](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-outbound-auth.html)
- [Gateway interceptors](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors.html)
- [GatewayTarget CloudFormation resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-gatewaytarget.html)

The overwritten-header and resource-handler observations come from maintainer-owned
private source, tests and deployment records. This release does not claim they persist
across every current Gateway target or region.
