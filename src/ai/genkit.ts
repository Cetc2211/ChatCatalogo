import { configureGenkit, GenkitPlugin } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const plugins: GenkitPlugin[] = [];

if (process.env.GEMINI_API_KEY) {
  plugins.push(
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  );
}

// Corrected from genkit.config to configureGenkit
configureGenkit({
  plugins,
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
