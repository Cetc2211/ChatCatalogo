'use server';

import { promises as fs } from 'fs';
import path from 'path';

export async function saveGeminiApiKey(apiKey: string) {
  if (!apiKey) {
    return { success: false, error: 'La clave API de Gemini es obligatoria.' };
  }

  try {
    // En entornos serverless como Vercel, solo se puede escribir en el directorio /tmp
    const configPath = path.join('/tmp', 'genkit-config.json');
    const config = { geminiApiKey: apiKey };

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    return { success: true };
  } catch (error) {
    console.error('Error al guardar la clave API de Gemini:', error);
    return { success: false, error: 'Ocurrió un error al guardar la configuración.' };
  }
}
