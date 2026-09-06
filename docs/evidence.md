# Evidence and version scope

Research date: 2026-09-06. The service that supplied these lessons has been retired.
Its historical status documents are not statements about currently deployed AWS state.

## How the material was refined

The research used maintainer-owned runtime source, container manifests, infrastructure
tests, deployment runbooks, architecture decisions and commit/PR history. Windows
Codex/Claude records and hub Codex/Hermes records provided debugging context and corrections.
An existing skills-design document supplied candidate lessons; it was not treated as
proof that every claim remained current.

Raw private sources are intentionally not bundled or linked as though readers can
access them. The source categories below distinguish historical evidence from what
anyone can reproduce in this repository.

| Lesson | Historical evidence | Public/current check |
| --- | --- | --- |
| Isolated manifest and actual boot | Container manifests and Hermes verification records | Current runtime SDK; local HTTP fixture |
| Callback-to-SSE bridge | Runtime handler and transport code | Offline lifecycle tests and current SDK serialization |
| Distinct idle/total/tool deadlines | Runtime adapter revisions and session discussion | Guidance; no remote timeout reproduction claimed |
| Caller bearer overwritten by signing | Gateway/interceptor implementation, tests and runbook | Offline header model; current target/auth references |
| Header allowlist agreement | IaC and upstream verifier contract tests | Offline missing-allowlist negative case |
| Environment shadows hydrated secret | Application loader and deployment configuration | Application-specific precedence, explicitly qualified |
| Target-kernel isolation | Canary failures and separate evaluator architecture | Historical case only; no current sandbox limitation asserted |
| Version/digest binding | Release receipts and endpoint transition fixes | Current AWS versioning/API documentation |
| Retirement completion | Preservation and asynchronous teardown records | Documented distinction between accepted deletion and confirmed absence |

Historical baseline: `bedrock-agentcore` npm 0.4.1, Strands TypeScript 1.13.0,
Node 22.23.1, ARM64 container; service observations span summer 2026. Registry research
found runtime SDK 0.4.3. [Validation](validation.md) records actual execution and limits.

## Corrections to the original design

- An environment-over-secret priority is application logic, not a universal AWS rule.
- Missing logs/audit rows and aggregate 4XX counts do not uniquely prove a failure cause.
- IAM/SigV4 outbound credentials are not automatically end-user identity.
- Historical target credential requirements must be rechecked for current target types.
- A successful emulated image test is not deployed-kernel isolation proof.
- A deletion request is not completed cleanup or evidence of zero remaining cost.

Current source links appear beside the relevant lesson. The skills preserve useful
decision procedures while avoiding service account IDs, hostnames, secret names and
private implementation excerpts. No live AWS changes are needed for repository checks.
