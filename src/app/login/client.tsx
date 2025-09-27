
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin/products';
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    const ADMIN_EMAIL = 'mpceciliotopetecruz@gmail.com';
    const ADMIN_PASSWORD = 'Nomeacuerdo221182';
    
    if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
      login(data.email);
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "Redirigiendo al panel de administración...",
      });
      router.push(redirectUrl);
    } else {
      console.error("Authentication failed");
      toast({
        variant: "destructive",
        title: "Error de Inicio de Sesión",
        description: "Las credenciales son incorrectas. Por favor, inténtalo de nuevo.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Catálogo de Chat Commerce</span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Inicio de Sesión de Administrador</CardTitle>
            <CardDescription>Introduce tus credenciales para acceder al panel de administración.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ejemplo.com"
                  {...register('email')}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Email: mpceciliotopetecruz@gmail.com</p>
            <p>Contraseña: Nomeacuerdo221182</p>
        </div>
      </div>
    </div>
  );
}
