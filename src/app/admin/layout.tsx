import AuthGuard from '@/components/auth-guard';
import AdminLayout from '@/components/admin/admin-layout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}
