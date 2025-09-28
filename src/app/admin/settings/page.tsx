import { Suspense } from 'react';
import SettingsClient from './client';

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SettingsClient />
    </Suspense>
  );
}
