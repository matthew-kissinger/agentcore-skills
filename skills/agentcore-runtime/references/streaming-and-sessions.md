# Streaming is a lifecycle, not a content type

## Bridge push progress to pull consumption

An agent loop often calls `onProgress(event)` while its final result arrives from a
promise. An HTTP runtime may consume an async generator instead. The field service
bridged these with a queue, waking the generator whenever progress or completion
arrived. It yielded structured `{ data: frame }` envelopes for the npm runtime's SSE
path and selected that path with `Accept: text/event-stream`.

Check the installed runtime SDK's serialization. Pre-stringifying an object that the
SSE layer already serializes can produce a JSON string where the client expects an
object. Test decoding through the actual server/client boundary once.

Use [the offline bridge](../scripts/progress-stream.mjs) to explore these properties:

- Wake the consumer on progress, completion and error; never leave it parked forever.
- Drain queued frames before successful completion.
- Preserve the result or failure as a terminal outcome.
- Bound the queue or apply backpressure; progress must not grow memory without limit.
- Abort cooperative work when the consumer exits, and define what happens to queued data.

If progress is disposable, coalescing it is another valid policy. Never silently drop
an essential artifact or terminal result under the same policy.

## Three clocks

Separate a caller's total deadline, the transport's idle deadline and one tool's
deadline. The retired service replaced a single wall timeout with idle detection plus
an explicit overall bound because legitimate model/tool work could be long-running.
Heartbeats can establish liveness, but cannot prove useful progress or authorize an
unbounded job. Verify whether the SDK emits comment frames and whether the client
counts those as activity.

A disconnect is an uncertain outcome until the server's cancellation behavior is
known. Use a job identity and reconciliation path for durable work; do not retry a
side effect merely because the stream disappeared.

## Sessions are not durable application records

Decide whether an invocation resumes a conversation or starts an independent job.
Use session IDs according to the current API constraints and isolate tenants. Do not
reuse one global session ID for unrelated callers.

Runtime session state, Strands conversation persistence, AgentCore Memory and a
product's durable database are separate stores. Write down who owns each. The field
application kept durable results in its web tier; an ephemeral runtime session was
not its record of truth.

When explicitly stopping a session, accept only the documented already-absent outcome
as idempotent success. A generic 404, permission error or timeout is not equivalent.

## Sources

- [Runtime sessions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html)
- [InvokeAgentRuntime API](https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntime.html)
- [StopRuntimeSession API](https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_StopRuntimeSession.html)
- [Runtime TypeScript SDK](https://github.com/aws/bedrock-agentcore-sdk-typescript)

The queue, timeout and persistence decisions derive from the maintainer's retired
service. The example tests local lifecycle behavior; it does not contact AWS.
