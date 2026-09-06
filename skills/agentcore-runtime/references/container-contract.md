# The image is the unit that must work

## Start at the service boundary

For an HTTP BYO container, verify the current Runtime requirements for architecture,
bind address, port, health and invocation endpoints. The historical TypeScript service
used ARM64, `0.0.0.0:8080`, `GET /ping` and `POST /invocations` through
`BedrockAgentCoreApp`. See the [AWS contract](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-service-contract.html)
and [official TypeScript deployment guide](https://strandsagents.com/docs/user-guide/deploy/deploy_to_bedrock_agentcore/typescript/).

Compiling TypeScript or running it through `tsx` are both architectural choices.
Evaluate startup, dependency size and deployment reproducibility; do not infer that
every app needs the exact build strategy used in a tutorial.

## A workspace can hide an incomplete image manifest

The retired service had a Bun API image and an npm Agent image. The workspace's
installed packages made local imports work while the Agent image still needed
explicit provider SDK dependencies. Even a lazily imported SDK plugin could introduce
an unexpected package requirement during boot.

Use the image manifest, lockfile and entrypoint in a fresh directory or build stage.
Check install, module resolution and runtime boot separately. A bundle succeeding
does not prove that a native module or dynamically imported dependency can load.

The field image used `--legacy-peer-deps` because the pinned Strands optional peer
ranges conflicted with tested provider versions. That flag was a documented exception,
not a recommended default. Prefer a compatible peer set; if retaining an exception,
test the actual imports and tool loop and commit a lockfile made with the same flags.

Pin the supported Node/package-manager pair. A base image tag does not by itself
prove the exact npm version used to generate a lockfile. Avoid copying a host
`node_modules` tree into an ARM64 image.

## Payload and logging boundaries

An upstream API accepting an image does not prove the runtime HTTP parser accepts
the same encoded size. Align limits across request validation, base64 expansion,
HTTP body parsing and service limits. Exercise a representative accepted payload and
one just beyond the intended boundary.

Review automatic request logging before sending provider keys or private content in
invocation payloads. Do not assume disabling access logs disables parser error logs.
Use synthetic sentinels to test malformed requests and ensure sensitive fields do not
appear in emitted diagnostics.

## Evidence level

These packaging and parser lessons come from maintainer-owned service source,
container manifests, Claude/Codex records and Hermes boot-verification records.
They are generalized observations from a retired service, not an independently
reproduced AWS deployment in this repository.

Current npm runtime implementation: [AWS TypeScript SDK](https://github.com/aws/bedrock-agentcore-sdk-typescript).
