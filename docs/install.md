# Installation

## Choose a skill and agent

Run these from your application project. First inspect the collection:

```sh
npx skills@1.5.23 add matthew-kissinger/agentcore-skills --list
```

Use the command for your host:

```sh
npx skills@1.5.23 add matthew-kissinger/agentcore-skills --skill agentcore-runtime --agent codex --copy
npx skills@1.5.23 add matthew-kissinger/agentcore-skills --skill agentcore-runtime --agent claude-code --copy
npx skills@1.5.23 add matthew-kissinger/agentcore-skills --skill agentcore-runtime --agent hermes-agent --copy
```

`--copy` avoids symlink requirements on Windows. Do not add `--global` unless you
want user-wide installation. Verify discovery in your host after installation.
For a pinned release, replace the shorthand with `https://github.com/matthew-kissinger/agentcore-skills/tree/v0.1.0`.
Keep the generated skill lockfile when reproducibility matters. Review updates before
reinstalling; avoid simultaneously installing a plugin and copies of the same skills.

## Manual copy

Clone the repository or download a per-skill ZIP from Releases. Copy the complete
skill directory, including references and scripts. Codex uses `.agents/skills/` and
Claude Code uses `.claude/skills/` for project skills. The current skills CLI targets
`.hermes/skills/` for Hermes; check your installed Hermes release's discovery support.
Copying only `SKILL.md` breaks its references.

Remove a CLI-installed skill with `npx skills@1.5.23 remove --skill agentcore-runtime --agent codex`,
or remove only the directory you manually copied.

## Claude Code plugin

```text
/plugin marketplace add matthew-kissinger/agentcore-skills
/plugin install agentcore-skills@agentcore-skills
```

Plugin scope controls differ from the project-local CLI workflow above. A Codex plugin
manifest is also included; direct skill installation is the tested baseline. Public
repository publication does not imply acceptance into a third-party catalog.

## Library maintainers

Each `skills/<name>` directory is self-contained. `npm run package` builds individual
ZIPs and checksums. A ZIP includes its skill folder and MIT license. Vendor a folder
or reference a release tag; preserve source links and version qualifiers.

Sources: [skills CLI](https://github.com/vercel-labs/skills),
[Codex](https://learn.chatgpt.com/docs/build-skills),
[Claude Code](https://code.claude.com/docs/en/skills),
[Hermes](https://hermes-agent.nousresearch.com/docs/guides/work-with-skills).
