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
        <div className="bg-white dark:bg-night-desert-100 rounded-lg shadow-desert p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-desert-800 dark:text-desert-100">
            Password Reset Successful
          </h2>
          <p className="text-center text-desert-700 dark:text-desert-300 mb-6">
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
      <div className="bg-white dark:bg-night-desert-100 rounded-lg shadow-desert p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-desert-800 dark:text-desert-100">
          Reset Your Password
        </h2>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-red-700 dark:text-red-300 text-sm">
              {error}
            </span>
          </div>
        )}
        
        {/* Reset password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-desert-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                placeholder="••••••••"
                required
              />
            </div>
            <p className="mt-1 text-xs text-desert-500 dark:text-desert-400">
              Must be at least 8 characters long
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-desert-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
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
