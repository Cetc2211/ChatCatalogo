import { AuthProvider } from '@/hooks/use-auth';
import LoginClient from './client';

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginClient />
    </AuthProvider>
  );
}
