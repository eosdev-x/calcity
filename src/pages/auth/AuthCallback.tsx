import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This handles the redirect from OAuth providers and password reset
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash and query parameters
        const hash = window.location.hash;
        const query = window.location.search;

        // If there's a hash, it might be an OAuth callback or password reset
        if (hash || query) {
          // Let Supabase handle the callback
          const { error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Auth callback error:', error);
            setError(error.message);
            return;
          }
          
          // Check if this is a password reset callback
          if (window.location.href.includes('type=recovery')) {
            navigate('/auth/reset-password');
            return;
          }
          
          // For successful OAuth logins, redirect to home
          navigate('/');
        } else {
          // If there's no hash or query, something went wrong
          setError('Invalid authentication callback. Please try again.');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="bg-surface-container-low rounded-xl shadow-sm p-8 max-w-md w-full border border-outline-variant">
        {error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-on-surface mb-4">
              Authentication Error
            </h2>
            <p className="text-on-surface-variant mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate('/auth/login')}
              className="btn-primary"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-on-surface-variant animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-on-surface mb-2">
              Completing Authentication
            </h2>
            <p className="text-on-surface-variant">
              Please wait while we complete the authentication process...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
