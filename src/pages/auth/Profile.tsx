import { useState } from 'react';
import { User, Mail, Save, Loader2, AlertCircle, MapPin, Phone, Globe, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Profile() {
  const { user, profile, updateProfile, error: authError } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [jobTitle, setJobTitle] = useState(profile?.job_title || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { error } = await updateProfile({ 
        full_name: fullName,
        bio,
        location,
        phone,
        website,
        company,
        job_title: jobTitle
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
              <div className="flex items-center space-x-3 text-desert-700 dark:text-desert-300 mb-2">
                <User className="w-5 h-5 text-desert-500" />
                <span>{profile?.full_name || 'Not set'}</span>
              </div>
              {profile?.location && (
                <div className="flex items-center space-x-3 text-desert-700 dark:text-desert-300 mb-2">
                  <MapPin className="w-5 h-5 text-desert-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.company && (
                <div className="flex items-center space-x-3 text-desert-700 dark:text-desert-300 mb-2">
                  <Briefcase className="w-5 h-5 text-desert-500" />
                  <span>{profile.company}{profile.job_title ? ` • ${profile.job_title}` : ''}</span>
                </div>
              )}
              {profile?.updated_at && (
                <div className="mt-2 text-sm text-desert-500 dark:text-desert-400">
                  Last updated: {new Date(profile.updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {/* Edit profile form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-desert-800 dark:text-desert-100 mb-4">
                  Edit Profile
                </h2>
                
                {/* Tabs */}
                <div className="flex border-b border-desert-200 dark:border-night-desert-600 mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'basic' 
                      ? 'text-desert-600 dark:text-desert-300 border-b-2 border-desert-500' 
                      : 'text-desert-500 dark:text-desert-400 hover:text-desert-700 dark:hover:text-desert-300'}`}
                  >
                    Basic Information
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'contact' 
                      ? 'text-desert-600 dark:text-desert-300 border-b-2 border-desert-500' 
                      : 'text-desert-500 dark:text-desert-400 hover:text-desert-700 dark:hover:text-desert-300'}`}
                  >
                    Contact Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('work')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'work' 
                      ? 'text-desert-600 dark:text-desert-300 border-b-2 border-desert-500' 
                      : 'text-desert-500 dark:text-desert-400 hover:text-desert-700 dark:hover:text-desert-300'}`}
                  >
                    Work & Bio
                  </button>
                </div>
              </div>
              
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
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
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-desert-400" />
                      </div>
                      <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contact Details Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-desert-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-desert-400" />
                      </div>
                      <input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Work & Bio Tab */}
              {activeTab === 'work' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                      Company
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-desert-400" />
                      </div>
                      <input
                        id="company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                        placeholder="Your company"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                      Job Title
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-desert-400" />
                      </div>
                      <input
                        id="jobTitle"
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                        placeholder="Your job title"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                      Bio
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <FileText className="h-5 w-5 text-desert-400" />
                      </div>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-600 dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                        placeholder="Tell us about yourself"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center justify-center mt-6"
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
