import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

genkit.config({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export default genkit;