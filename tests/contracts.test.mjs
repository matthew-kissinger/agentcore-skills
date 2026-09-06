import test from 'node:test';
import assert from 'node:assert/strict';
import { progressStream } from '../skills/agentcore-runtime/scripts/progress-stream.mjs';
import { FORWARDED, outboundHeaders, selectBearer } from '../skills/agentcore-gateway/scripts/header-contract.mjs';

test('progress is incremental and the result is structured exactly once', async () => {
  let finish;
  const gate = new Promise(resolve => { finish = resolve; });
  const stream = progressStream(async ({ emit }) => { emit({ step: 1 }); await gate; return { ok: true }; });
  assert.deepEqual((await stream.next()).value, { data: { type: 'progress', event: { step: 1 } } });
  finish();
  assert.deepEqual((await stream.next()).value, { data: { type: 'result', result: { ok: true } } });
  assert.equal((await stream.next()).done, true);
});
test('producer failure wakes a waiting consumer', async () => {
  const stream = progressStream(async () => { await Promise.resolve(); throw new Error('failed'); });
  await assert.rejects(stream.next(), /failed/);
});
test('consumer exit aborts cooperative work', async () => {
  let signal;
  const stream = progressStream(async ctx => {
    signal = ctx.signal; ctx.emit('ready');
    await new Promise(resolve => ctx.signal.addEventListener('abort', resolve, { once: true }));
  });
  await stream.next(); await stream.return();
  assert.equal(signal.aborted, true);
});
test('overflow fails explicitly even if producer catches emit failure', async () => {
  const stream = progressStream(async ({ emit }) => {
    try { emit(1); emit(2); } catch { /* intentionally suppressed by producer */ }
    return 'must not be reported as success';
  }, { capacity: 1 });
  await assert.rejects(Array.fromAsync(stream), /capacity exceeded/);
});
test('an empty producer still emits one terminal result', async () => {
  assert.deepEqual(await Array.fromAsync(progressStream(async () => 42)), [{ data: { type: 'result', result: 42 } }]);
});
test('a falsy rejection is still failure, never successful completion', async () => {
  const stream = progressStream(async () => { throw undefined; });
  const rejected = await Array.fromAsync(stream).then(() => false, () => true);
  assert.equal(rejected, true);
});
test('allowlisted caller identity survives modeled SigV4 overwrite', () => {
  const headers = outboundHeaders('Bearer synthetic-caller', [FORWARDED]);
  assert.match(headers.authorization, /^AWS4/);
  assert.equal(selectBearer(headers), 'Bearer synthetic-caller');
});
test('missing allowlist fails instead of using service signature as caller identity', () => {
  assert.throws(() => selectBearer(outboundHeaders('Bearer synthetic-caller', [])), /Missing caller/);
});
test('conflicting or malformed credential sources are rejected', () => {
  assert.throws(() => selectBearer({ authorization: 'Bearer caller', [FORWARDED]: 'Bearer other' }), /Ambiguous/);
  assert.throws(() => selectBearer({ authorization: 'Basic invalid', [FORWARDED]: 'Bearer caller' }), /Unsupported/);
  assert.throws(() => selectBearer({ [FORWARDED]: 'Bearer ' }), /Missing/);
});
