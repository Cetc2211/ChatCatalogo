import { defineFlow } from 'genkit';
import { geminiPro } from 'genkit/models';
import { z } from 'zod';

export const generateProductDescription = defineFlow(
    {
        name: 'generateProductDescription',
        inputSchema: z.object({
            productName: z.string(),
            productFeatures: z.array(z.string()),
        }),
        outputSchema: z.string(),
    },
    async (input) => {
        const prompt = `Genera una descripción de producto para un artículo llamado "${input.productName}" que tiene las siguientes características: ${input.productFeatures.join(', ')}.`;

        const llmResponse = await geminiPro.generate({ 
            prompt: prompt,
        });

        return llmResponse.text();
    }
);
