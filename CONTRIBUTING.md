# Contributing

Bring a reproducible failure or a task the skill handles poorly. Include SDK/adapter
versions, sanitized input, expected/observed behavior and the smallest useful evidence.
Never attach credentials or private logs.

1. Put the lesson in the skill that owns the decision. Split only for a distinct trigger.
2. Separate observations, invariants and explanations. Link public evidence or official docs.
3. Add a behavioral test for scripts or a scenario in `evals/scenarios.json` for decisions.
4. Run `npm ci --ignore-scripts`, `npm run check` and, for releases, `npm run package`.
5. Explain what the agent should do differently and what remains untested.

Keep entry points short and detail in references. Do not copy manuals or make one
incident a universal policy. Recheck the unpatched regression on an SDK upgrade;
remove obsolete shims when evidence supports it. Update version/evidence records.
Keep package and plugin release versions aligned.

## Evaluating behavior

Scenario files contain prompts and rubrics. Give a fresh agent only the prompt and
skill, then grade against the rubric. Use a credential-free temporary workspace.
Record host/model/version, skill revision and outcome. Structural checks do not prove
agent performance; successful installation does not prove behavioral parity.
