import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Turnstile } from '../Turnstile';

export function SignupForm() {
  const { signUp, signInWithGoogle, signInWithApple, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const { error } = await signUp(email, password);
      if (error) {
        setFormError(error.message);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If signup was successful, show a success message
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface-container-low rounded-xl shadow-sm p-8 border border-outline-variant">
          <h2 className="text-2xl font-bold text-center mb-6 text-on-surface">
            Check your email
          </h2>
          <p className="text-center text-on-surface-variant mb-6">
            We've sent you a confirmation email. Please check your inbox and follow the instructions to complete your registration.
          </p>
          <Link to="/auth/login" className="w-full btn-primary block text-center">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface-container-low rounded-xl shadow-sm p-8 border border-outline-variant">
        <h2 className="text-2xl font-bold text-center mb-6 text-on-surface">
          Create an account
        </h2>
        
        {/* Error message */}
        {(formError || error) && (
          <div className="mb-4 p-3 bg-error-container border border-error rounded-xl flex items-start">
            <AlertCircle className="w-5 h-5 text-error mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-on-error-container text-sm">
              {formError || error}
            </span>
          </div>
        )}
        
        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-on-surface-variant mb-1">
              Full Name (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-on-surface-variant" />
              </div>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-on-surface-variant mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-on-surface-variant" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-on-surface-variant mb-1">
              Password
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
              Confirm Password
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

          <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="w-full btn-primary flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>
        
        {/* Divider */}
        <div className="mt-6 mb-6 flex items-center">
          <div className="flex-grow border-t border-outline-variant"></div>
          <span className="mx-4 text-sm text-on-surface-variant">Or continue with</span>
          <div className="flex-grow border-t border-outline-variant"></div>
        </div>
        
        {/* Social signup buttons */}
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
        
        {/* Login link */}
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
