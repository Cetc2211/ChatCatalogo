
import { startGenkit } from '@genkit-ai/nextjs';
import '@/ai/genkit'; // Import to initialize Genkit configuration
import { generateProductDescription } from '@/ai/flows/generate-product-description';

// This is the crucial API route that exposes your Genkit flows to the Next.js environment.
// It ensures that Genkit is properly initialized and that your flows are registered.
export const POST = startGenkit({
  flows: [generateProductDescription], // Make sure all your flows are listed here
});
