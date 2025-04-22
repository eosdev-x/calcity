import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-desert-50 dark:bg-night-desert-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-desert-500 animate-spin mx-auto mb-4" />
          <p className="text-desert-700 dark:text-desert-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page with return URL
  if (!user) {
    return <Navigate to={`${redirectTo}?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}
