'''
import { Suspense } from 'react';
import LoginClient from './client';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginClient />
    </Suspense>
  );
}
'''