// A bounded push-to-pull bridge. run({emit, signal}) must honor signal cooperatively.
// Returns objects suitable for an SSE adapter that serializes data once.
export async function* progressStream(run, { capacity = 64 } = {}) {
  if (!Number.isInteger(capacity) || capacity < 1) throw new RangeError('capacity must be positive');
  const controller = new AbortController();
  const queue = [];
  let wake;
  let done = false;
  let failure;
  let failed = false;
  let result;
  const notify = () => { const next = wake; wake = undefined; next?.(); };
  const emit = event => {
    if (done || controller.signal.aborted) return;
    if (queue.length >= capacity) {
      failure = new Error('Progress queue capacity exceeded');
      failed = true;
      done = true;
      controller.abort(failure);
      notify();
      throw failure;
    }
    queue.push({ type: 'progress', event });
    notify();
  };
  // Attach rejection handling immediately, including after consumer cancellation.
  const work = Promise.resolve().then(() => run({ emit, signal: controller.signal }))
    .then(value => { result = value; }, error => { if (!failed) failure = error; failed = true; })
    .finally(() => { done = true; notify(); });
  try {
    for (;;) {
      while (queue.length) yield { data: queue.shift() };
      if (done) break;
      await new Promise(resolve => {
        if (queue.length || done) resolve(); else wake = resolve;
      });
    }
    if (failed) throw failure;
    await work;
    yield { data: { type: 'result', result } };
  } finally {
    controller.abort();
    notify();
    // Do not await a producer that ignores cancellation indefinitely.
  }
}
