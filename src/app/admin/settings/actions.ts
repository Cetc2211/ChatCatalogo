'use server';

import { promises as fs } from 'fs';
import path from 'path';

export async function saveGeminiApiKey(apiKey: string) {
  if (!apiKey) {
    return { success: false, error: 'La clave API de Gemini es obligatoria.' };
  }

  try {
    const envLocalPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    try {
      envContent = await fs.readFile(envLocalPath, 'utf-8');
    } catch (error) {
      // El archivo .env.local no existe, se creará uno nuevo.
    }

    const lines = envContent.split('\n');
    let keyExists = false;

    const newLines = lines.map(line => {
      if (line.startsWith('GEMINI_API_KEY=')) {
        keyExists = true;
        return `GEMINI_API_KEY=${apiKey}`;
      }
      return line;
    });

    if (!keyExists) {
      newLines.push(`GEMINI_API_KEY=${apiKey}`);
    }

    await fs.writeFile(envLocalPath, newLines.join('\n'));

    return { success: true };
  } catch (error) {
    console.error('Error al guardar la clave API de Gemini:', error);
    return { success: false, error: 'Ocurrió un error al guardar la configuración.' };
  }
}
