---
name: agentcore-runtime
description: Build or debug applications on Amazon Bedrock AgentCore Runtime, especially TypeScript BYO containers, SSE streaming, image boot failures, session lifecycle and generated-code isolation. Use for Runtime implementation; not for Gateway auth or general Bedrock model selection.
license: MIT
metadata:
  author: matthew-kissinger
  version: "0.1.0"
---

# AgentCore Runtime beyond a successful image build

Identify language, deployment owner, transport and the exact failing boundary.
Preserve existing CDK, Terraform or CLI ownership. Do not introduce a second
infrastructure generator into a working deployment merely to follow a quickstart.

## Route by boundary

| Problem | Read |
| --- | --- |
| Container builds but will not boot; TypeScript packaging | [Container contract](references/container-contract.md) |
| Buffered progress, lost result, disconnect, timeout or session confusion | [Streaming and sessions](references/streaming-and-sessions.md) |
| Running generated code; local sandbox works but deployed kernel fails | [Isolation boundaries](references/isolation.md) |

Start with the [current Runtime contract](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-service-contract.html)
for required endpoints and supported transport details. Field examples here originated
with `bedrock-agentcore` npm 0.4.1; inspect the installed version before adapting them.

## Prove progressively

1. Install only the image's manifest in an isolated directory, using the image's
   package manager, flags and lockfile. A workspace install can conceal missing peers.
2. Boot the actual entrypoint and exercise health plus a provider-free invocation.
3. Check streaming as incremental frames and a terminal outcome, not merely HTTP 200.
4. Bind any remote verification to the deployed digest, runtime version and endpoint.
5. Report what each check proves. Local boot does not prove IAM, networking or the
   target kernel; remote health does not prove a model/tool round trip.

Use [the callback-to-generator example](scripts/progress-stream.mjs) to explore queue,
failure and cancellation behavior offline. It is a transport building block, not
a complete deployed service or a claim that remote work stops when a browser closes.
For the SDK HTTP boundary, [the local runtime fixture](scripts/local-runtime.mjs)
is exercised by the repository's loopback integration test, including a session header.

For authorized deployments, follow the project's existing change controls. Prepare
reviewable changes and identify costs/side effects before performing a new mutation.
