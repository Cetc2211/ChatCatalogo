import AuthGuard from '@/components/auth-guard';
import AdminLayout from '@/components/admin/admin-layout';
import { AuthProvider } from '@/hooks/use-auth';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <AdminLayout>{children}</AdminLayout>
      </AuthGuard>
    </AuthProvider>
  );
}
