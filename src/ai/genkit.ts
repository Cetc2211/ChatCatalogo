import { genkit, GenkitPlugin } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const plugins: GenkitPlugin[] = [];

if (process.env.GEMINI_API_KEY) {
  plugins.push(
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  );
}

genkit.config({
  plugins,
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export default genkit;