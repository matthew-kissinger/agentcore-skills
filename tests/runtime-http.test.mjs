import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('actual runtime SDK serves health and structured SSE on loopback', { timeout: 20000 }, async t => {
  const child = spawn(process.execPath, [fileURLToPath(new URL('../skills/agentcore-runtime/scripts/local-runtime.mjs', import.meta.url))], {
    env: { ...process.env, LOCAL_TEST_PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
  });
  t.after(async () => {
    if (child.exitCode === null) {
      const closed = new Promise(resolve => child.once('exit', resolve));
      child.kill(); await closed;
    }
  });
  let output = '';
  const origin = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Runtime boot timeout: ' + output)), 12000);
    child.once('error', e => { clearTimeout(timer); reject(e); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Runtime exited ${code}: ${output}`)); });
    const consume = chunk => {
      output += chunk.toString();
      const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) { clearTimeout(timer); resolve(match[0]); }
    };
    child.stdout.on('data', consume); child.stderr.on('data', consume);
  });
  assert.equal((await fetch(origin + '/ping')).status, 200);
  const response = await fetch(origin + '/invocations', {
    method: 'POST', headers: { 'content-type': 'application/json', accept: 'text/event-stream',
      'x-amzn-bedrock-agentcore-runtime-session-id': 'fixture-00000000000000000000000000' },
    body: JSON.stringify({ message: 'synthetic-fixture' }),
  });
  if (response.status !== 200) throw new Error(`Invocation ${response.status}: ${await response.text()} Logs: ${output}`);
  assert.match(response.headers.get('content-type'), /text\/event-stream/);
  const frames = (await response.text()).split(/\r?\n/).filter(l => l.startsWith('data:'))
    .map(l => JSON.parse(l.slice(5).trim()));
  assert.deepEqual(frames, [
    { type: 'progress', event: { received: true } },
    { type: 'result', result: { echo: 'synthetic-fixture' } },
  ]);
  const invalid = await fetch(origin + '/invocations', {
    method: 'POST', headers: { 'content-type': 'application/json',
      'x-amzn-bedrock-agentcore-runtime-session-id': 'fixture-00000000000000000000000000' }, body: JSON.stringify({ message: 7 }),
  });
  assert.equal(invalid.status, 400);
});
