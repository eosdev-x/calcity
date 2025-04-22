import { useState } from 'react';
import { User, Mail, Save, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Profile() {
  const { user, profile, updateProfile, error: authError } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { error } = await updateProfile({ 
        full_name: fullName 
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Profile updated successfully');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-desert-800 dark:text-desert-100 mb-8">
            Your Profile
          </h1>
          
          <div className="bg-white dark:bg-night-desert-100 rounded-lg shadow-desert p-8">
            {/* Success message */}
            {successMessage && (
              <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-md flex items-start">
                <div className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5">✓</div>
                <span className="text-green-700 dark:text-green-300">
                  {successMessage}
                </span>
              </div>
            )}
            
            {/* Error message */}
            {(error || authError) && (
              <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-red-700 dark:text-red-300">
                  {error || authError}
                </span>
              </div>
            )}
            
            {/* User information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-desert-800 dark:text-desert-100 mb-4">
                Account Information
              </h2>
              <div className="flex items-center space-x-3 text-desert-700 dark:text-desert-300 mb-2">
                <Mail className="w-5 h-5 text-desert-500" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-desert-700 dark:text-desert-300">
                <User className="w-5 h-5 text-desert-500" />
                <span>{profile?.full_name || 'Not set'}</span>
              </div>
            </div>
            
            {/* Edit profile form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-desert-800 dark:text-desert-100 mb-2">
                Edit Profile
              </h2>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-desert-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
