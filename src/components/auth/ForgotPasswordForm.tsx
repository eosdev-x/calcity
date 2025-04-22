import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function ForgotPasswordForm() {
  const { resetPassword, error } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setFormError('Please enter your email address.');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const { error } = await resetPassword(email);
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

  // If password reset email was sent successfully, show a success message
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-night-desert-100 rounded-lg shadow-desert p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-desert-800 dark:text-desert-100">
            Check your email
          </h2>
          <p className="text-center text-desert-700 dark:text-desert-300 mb-6">
            We've sent you a password reset link. Please check your inbox and follow the instructions to reset your password.
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
      <div className="bg-white dark:bg-night-desert-100 rounded-lg shadow-desert p-8">
        <h2 className="text-2xl font-bold text-center mb-2 text-desert-800 dark:text-desert-100">
          Reset your password
        </h2>
        <p className="text-center text-desert-700 dark:text-desert-300 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {/* Error message */}
        {(formError || error) && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-red-700 dark:text-red-300 text-sm">
              {formError || error}
            </span>
          </div>
        )}
        
        {/* Password reset form */}
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
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send reset link'
            )}
          </button>
        </form>
        
        {/* Back to login link */}
        <div className="mt-6 text-center">
          <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-desert-600 dark:text-desert-400 hover:text-desert-500 dark:hover:text-desert-300">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
