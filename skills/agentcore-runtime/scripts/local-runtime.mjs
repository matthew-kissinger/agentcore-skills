import { BedrockAgentCoreApp } from 'bedrock-agentcore/runtime';
import { z } from 'zod';
import { progressStream } from './progress-stream.mjs';

// Local, provider-free fixture. No authentication or AWS deployment is configured.
const app = new BedrockAgentCoreApp({
  invocationHandler: {
    requestSchema: z.object({ message: z.string() }),
    process: async function* (request) {
      yield* progressStream(async ({ emit }) => {
        emit({ received: true });
        return { echo: request.message };
      });
    },
  },
  config: { logging: { disableRequestLogging: true } },
});
// Port zero lets the OS allocate an unused local test port. SDK startup logs report it.
app.run({ host: '127.0.0.1', port: Number(process.env.LOCAL_TEST_PORT ?? 8080) });
