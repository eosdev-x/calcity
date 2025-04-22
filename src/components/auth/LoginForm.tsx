import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function LoginForm() {
  const { signIn, signInWithGoogle, signInWithApple, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setFormError(error.message);
      }
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-night-desert-100 rounded-lg shadow-desert p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-desert-800 dark:text-desert-100">
          Log in to your account
        </h2>
        
        {/* Error message */}
        {(formError || error) && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-red-700 dark:text-red-300 text-sm">
              {formError || error}
            </span>
          </div>
        )}
        
        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-desert-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-desert-700 dark:text-desert-300">
                Password
              </label>
              <Link to="/auth/forgot-password" className="text-sm text-desert-600 dark:text-desert-400 hover:text-desert-500 dark:hover:text-desert-300">
                Forgot password?
              </Link>
            </div>
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
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-desert-600 focus:ring-desert-500 border-desert-300 dark:border-night-desert-600 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-desert-700 dark:text-desert-300">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              'Log in'
            )}
          </button>
        </form>
        
        {/* Divider */}
        <div className="mt-6 mb-6 flex items-center">
          <div className="flex-grow border-t border-desert-300 dark:border-night-desert-600"></div>
          <span className="mx-4 text-sm text-desert-500 dark:text-desert-400">Or continue with</span>
          <div className="flex-grow border-t border-desert-300 dark:border-night-desert-600"></div>
        </div>
        
        {/* Social login buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="btn-secondary flex justify-center items-center"
          >
            <img src="/google-logo.svg" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </button>
          <button
            type="button"
            onClick={() => signInWithApple()}
            className="btn-secondary flex justify-center items-center"
          >
            <img src="/apple-logo.svg" alt="Apple" className="w-5 h-5 mr-2" />
            Apple
          </button>
        </div>
        
        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-desert-700 dark:text-desert-300">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="font-medium text-desert-600 dark:text-desert-400 hover:text-desert-500 dark:hover:text-desert-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
