import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(p, 'utf8');
const json = p => JSON.parse(read(resolve(root, p)));
const pkg = json('package.json');
const skills = readdirSync(resolve(root, 'skills')).filter(s => existsSync(resolve(root, 'skills', s, 'SKILL.md')));
assert.ok(skills.length, 'No skills');
for (const name of skills) {
  const text = read(resolve(root, 'skills', name, 'SKILL.md'));
  const match = /^---\r?\n([\s\S]+?)\r?\n---\r?\n/.exec(text);
  assert.ok(match, `${name}: YAML frontmatter required`);
  assert.match(name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(name.length <= 64);
  assert.equal(/^name:\s*(.+)$/m.exec(match[1])?.[1], name);
  const description = /^description:\s*(.+)$/m.exec(match[1])?.[1];
  assert.ok(description && description.length <= 1024, `${name}: description`);
  assert.ok(text.split('\n').length < 500, `${name}: entrypoint too large`);
  assert.ok(!/\[TODO|FIXME|PLACEHOLDER/.test(text), `${name}: unfinished content`);
}
for (const file of ['.codex-plugin/plugin.json', '.claude-plugin/plugin.json']) {
  const plugin = json(file);
  assert.equal(plugin.name, pkg.name);
  assert.equal(plugin.version, pkg.version);
  assert.equal(plugin.license, 'MIT');
}
const market = json('.claude-plugin/marketplace.json');
assert.equal(market.plugins[0].name, pkg.name);
assert.equal(market.plugins[0].source, './');
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (['node_modules', '.git', 'dist', '.tmp'].includes(e.name)) return [];
    const p = resolve(dir, e.name);
    assert.ok(!e.isSymbolicLink(), `Unexpected symlink: ${p}`);
    return e.isDirectory() ? walk(p) : [p];
  });
}
for (const p of walk(root)) {
  if (!/\.(md|json|mjs|yml|py)$/.test(p)) continue;
  const text = read(p);
  // Deliberately narrow credential checks. Not a general secret-scanning guarantee.
  assert.ok(!/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/.test(text), `AWS key in ${p}`);
  assert.ok(!/\bgithub_pat_[A-Za-z0-9_]{30,}/.test(text), `GitHub token in ${p}`);
  if (!p.endsWith('.md')) continue;
  for (const m of text.matchAll(/\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) {
    const link = m[1];
    if (/^(?:https?:|#|mailto:)/.test(link)) continue;
    const target = resolve(dirname(p), decodeURIComponent(link.split('#')[0]));
    const rel = relative(root, target);
    assert.ok(rel !== '..' && !rel.startsWith('..' + sep), `External local link in ${p}`);
    assert.ok(existsSync(target), `Broken local link: ${relative(root,p)} -> ${link}`);
    // A copied skill must not reach back into its repository for required resources.
    const skill = skills.find(s => p.startsWith(resolve(root, 'skills', s) + sep));
    if (skill) assert.ok(target.startsWith(resolve(root, 'skills', skill) + sep), `Nonportable skill link: ${link}`);
  }
}
const scenarios = json('evals/scenarios.json');
assert.ok(scenarios.length >= 4);
for (const s of scenarios) {
  assert.ok(s.id && s.prompt && s.expected.length && s.failures.length);
  assert.ok(skills.includes(s.skill) || s.skill === null);
}
console.log(`Validated ${skills.length} skills, manifests, local links and ${scenarios.length} scenarios`);
