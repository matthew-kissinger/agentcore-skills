# Related work and the intended contribution

Reviewed 2026-09-06. This is a scope comparison, not a performance ranking.

| Resource | Strength | How these skills complement it |
| --- | --- | --- |
| [AgentCore developer guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/) | Service contract and current configuration/API guidance | Add field-derived questions about identity propagation, application precedence and what each verification step actually proves |
| [AWS Agent Toolkit](https://github.com/aws/agent-toolkit-for-aws) | AWS tooling and skills spanning service selection and implementation | Keep an existing toolkit/IaC workflow; load a focused Runtime, Gateway or operations skill for the boundary under investigation |
| [AWSBedrockAgentCoreSkill](https://github.com/ferdinandobons/AWSBedrockAgentCoreSkill) | Broad references for architecture, identity, deployment, testing and multiple frameworks | Offer smaller incident-oriented guidance and offline examples, without pretending to replace that reference library |
| [Strands TypeScript deployment guide](https://strandsagents.com/docs/user-guide/deploy/deploy_to_bedrock_agentcore/typescript/) | An official TypeScript path to Runtime | Go deeper on image-only dependency resolution, callback/SSE lifecycle and runtime evidence |

The broader community skill already discusses many production concerns. Our earlier
private design underestimated its scope and current TypeScript documentation; this
release removes those claims. What should distinguish this work is specificity and
restraint: a generic 401 is not a diagnosis, missing logs are not execution proof,
and a historical resource-handler workaround is not a timeless AWS requirement.

## Repository ergonomics

We reviewed [Vercel](https://github.com/vercel-labs/agent-skills),
[Anthropic](https://github.com/anthropics/skills) and
[OpenAI](https://github.com/openai/skills) collections for installation and authoring
patterns. This repository uses the shared `SKILL.md` format, a selectable `skills/`
layout, a Claude marketplace, a Codex manifest and per-skill release ZIPs.

The documentation separates users installing skills from developers testing examples.
No AWS account or model key is required for ordinary repository validation. Live
deployment remains a separate authorized activity. Catalog inclusion is not claimed.
