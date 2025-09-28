'use server';

import { generateProductDescription } from '@/ai/flows/generate-product-description';

export async function generateDescriptionAction(productName: string, category: string | null) {
  // Basic validation
  if (!productName || !category) {
    return { success: false, error: "El nombre y la categoría son necesarios para generar la descripción." };
  }

  try {
    const description = await generateProductDescription.run({
      productName,
      category,
    });
    return { success: true, description };
  } catch (error) {
    console.error('Error generating AI description:', error);
    // Log the specific error for debugging on the server.
    return { success: false, error: "No se pudo generar la descripción con IA. Revisa los logs del servidor para más detalles." };
  }
}
