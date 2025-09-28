
import { defineFlow } from 'genkit';
import * as z from 'zod';
import { geminiPro } from '@genkit-ai/googleai';

const prompt = (
  { productName, category }: { productName: string, category: string }
) => `Genera una descripción atractiva y concisa para el siguiente producto, sin usar markdown y en menos de 150 caracteres:

Nombre del Producto: ${productName}
Categoría: ${category}

Descripción:`;

export const generateProductDescription = defineFlow(
  {
    name: 'generateProductDescription',
    inputSchema: z.object({
      productName: z.string(),
      category: z.string(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const llmResponse = await geminiPro.generate({
      prompt: prompt(input),
    });

    return llmResponse.text();
  }
);
