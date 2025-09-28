import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { promises as fs } from 'fs';
import path from 'path';

async function getApiKey() {
  try {
    // Ruta para entornos serverless como Vercel
    const configPath = path.join('/tmp', 'genkit-config.json');
    const configFile = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configFile);
    if (config.geminiApiKey) {
      return config.geminiApiKey;
    }
  } catch (error) {
    // Si el archivo no existe, no se puede leer o no tiene la clave,
    // se intentará usar la variable de entorno como alternativa.
    console.log('No se encontró el archivo de configuración o la clave. Usando variable de entorno.');
  }

  return process.env.GEMINI_API_KEY;
}

genkit.config({
  plugins: [googleAI({ apiKey: await getApiKey() })],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export default genkit;
