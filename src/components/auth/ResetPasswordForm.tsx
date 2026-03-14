import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Extract the hash fragment from the URL
  useEffect(() => {
    // The hash contains the access token
    const hashParams = new URLSearchParams(location.hash.substring(1));
    if (!hashParams.get('access_token')) {
      setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, [location]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        setError(error.message);
      } else {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If password was reset successfully, show a success message
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface-container-low rounded-xl shadow-sm p-8 border border-outline-variant">
          <h2 className="text-2xl font-bold text-center mb-6 text-on-surface">
            Password Reset Successful
          </h2>
          <p className="text-center text-on-surface-variant mb-6">
            Your password has been successfully reset. You will be redirected to the login page shortly.
          </p>
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full btn-primary block text-center"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface-container-low rounded-xl shadow-sm p-8 border border-outline-variant">
        <h2 className="text-2xl font-bold text-center mb-6 text-on-surface">
          Reset Your Password
        </h2>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-error-container border border-error rounded-xl flex items-start">
            <AlertCircle className="w-5 h-5 text-error mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-on-error-container text-sm">
              {error}
            </span>
          </div>
        )}
        
        {/* Reset password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-on-surface-variant mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-on-surface-variant" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                required
              />
            </div>
            <p className="mt-1 text-xs text-on-surface-variant">
              Must be at least 8 characters long
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-on-surface-variant mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-on-surface-variant" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Resetting password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
