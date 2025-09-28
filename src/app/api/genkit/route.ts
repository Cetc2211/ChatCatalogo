import { createApiHandler } from '@genkit-ai/next';
import '@/ai/genkit'; // Import to initialize Genkit configuration
import { generateProductDescription } from '@/ai/flows/generate-product-description';

// Corrected from startGenkit to createApiHandler
export const POST = createApiHandler({
  flows: [generateProductDescription], // Make sure all your flows are listed here
});
