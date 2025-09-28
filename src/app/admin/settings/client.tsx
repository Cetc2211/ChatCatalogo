'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { saveGeminiApiKey } from './actions';

const settingsSchema = z.object({
  geminiApiKey: z.string().min(1, { message: "La clave API de Gemini es obligatoria." }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsClient() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      geminiApiKey: '',
    }
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setLoading(true);
    const result = await saveGeminiApiKey(data.geminiApiKey);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Ajustes Guardados",
        description: "La clave API de Gemini ha sido guardada correctamente. Para que los cambios surtan efecto, reinicia el servidor de desarrollo.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Ocurrió un error al guardar la configuración.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajustes</CardTitle>
        <CardDescription>Configura la clave API de Gemini para la aplicación. Después de guardar la clave, reinicia el servidor para aplicar los cambios.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="geminiApiKey">Clave API de Gemini</Label>
            <div className="relative">
              <Input
                id="geminiApiKey"
                type={showApiKey ? 'text' : 'password'}
                placeholder="Introduce tu clave API de Gemini"
                {...register('geminiApiKey')}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
              >
                {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.geminiApiKey && <p className="text-sm text-destructive">{errors.geminiApiKey.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
