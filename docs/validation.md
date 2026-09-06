# Validation

Release: 0.1.0. Checked 2026-09-06.

## Executed checks

- Ten offline/loopback tests: incremental progress, terminal result, producer error,
  consumer cancellation, queue overflow, empty producer, falsy rejection, header
  propagation and negative credential cases, plus the actual HTTP runtime boundary.
- `bedrock-agentcore` npm 0.4.3 booted on loopback; `/ping`, schema rejection and
  structured SSE invocation were exercised through HTTP with a synthetic session ID.
- The first HTTP fixture omitted the required session header and failed. Adding it
  fixed the invocation; this is why the test exercises actual HTTP instead of just
  asserting the queue's object shape.
- Skill metadata, local references and plugin manifests validated.
- Skills CLI 1.5.23 discovered and copied all three skills into temporary project
  paths for Codex, Claude Code and Hermes, without global configuration changes.
- Public reference links checked; misleading AWS redirects replaced with real pages.
- Per-skill ZIP packaging includes supporting files and license, with checksums.

Tests passed on Windows with Node 24.20.0 and 22.23.1. CI checks Node 22 on Windows and
Linux; inspect the workflow for the result on the published revision.

## Limits

No AWS resources were created, deployed or invoked. The Gateway test models header
agreement; it does not perform AWS SigV4 signing or JWT cryptographic validation.
No ARM64 container, deployed IAM, VPC or target-kernel isolation was tested here.
The historical service observations are labeled accordingly.

Seven fresh-agent scenarios are supplied in `evals/scenarios.json`; they were reviewed
as decision rubrics, not run as a cross-model performance benchmark. Installation
compatibility does not establish equivalent behavior across agent hosts.

## Publication checks

Both public repositories were installed with Skills CLI 1.5.23 into temporary
project paths for Codex, Claude Code and Hermes. Native Claude marketplace
validation passed without warnings. Windows and Linux CI passed before release;
GitHub Actions records checks for each commit.
