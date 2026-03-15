import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { profile, user, isLoading } = useAuth();

  if (isLoading || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-on-surface-variant animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {profile?.role === 'admin' ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4">
          <div className="card max-w-md w-full text-center">
            <h1 className="text-2xl font-semibold text-on-surface mb-2">403 Forbidden</h1>
            <p className="text-on-surface-variant mb-6">
              You don&apos;t have permission to access this page.
            </p>
            <Link to="/" className="btn-primary inline-flex">
              Return home
            </Link>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
