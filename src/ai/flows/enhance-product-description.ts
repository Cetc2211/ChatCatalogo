'use server';

/**
 * @fileOverview This file defines a Genkit flow for enhancing product descriptions using AI.
 *
 * It includes:
 * - enhanceProductDescription - A function that takes a product name and description as input and returns an enhanced description.
 * - EnhanceProductDescriptionInput - The input type for the enhanceProductDescription function.
 * - EnhanceProductDescriptionOutput - The output type for the enhanceProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The current description of the product.'),
});
export type EnhanceProductDescriptionInput = z.infer<typeof EnhanceProductDescriptionInputSchema>;

const EnhanceProductDescriptionOutputSchema = z.object({
  enhancedDescription: z.string().describe('The enhanced description of the product.'),
});
export type EnhanceProductDescriptionOutput = z.infer<typeof EnhanceProductDescriptionOutputSchema>;

export async function enhanceProductDescription(
  input: EnhanceProductDescriptionInput
): Promise<EnhanceProductDescriptionOutput> {
  return enhanceProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceProductDescriptionPrompt',
  input: {schema: EnhanceProductDescriptionInputSchema},
  output: {schema: EnhanceProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in e-commerce product descriptions.
Your goal is to create compelling and engaging descriptions that will entice customers to purchase the product.

Based on the following product name and description, generate an enhanced product description.

Product Name: {{{productName}}}
Current Description: {{{productDescription}}}`,
});

const enhanceProductDescriptionFlow = ai.defineFlow(
  {
    name: 'enhanceProductDescriptionFlow',
    inputSchema: EnhanceProductDescriptionInputSchema,
    outputSchema: EnhanceProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
