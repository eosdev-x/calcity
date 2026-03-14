import { useState } from 'react';
import { User, Mail, Save, Loader2, AlertCircle, MapPin, Phone, Globe, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import { siteConfig } from '../../config/site';

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
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.profileTitle}
        path="/profile"
        noindex
      />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-on-surface mb-8">
            Your Profile
          </h1>
          
          <div className="bg-surface-container-low rounded-xl shadow-sm p-8 border border-outline-variant">
            {/* Success message */}
            {successMessage && (
              <div className="mb-6 p-3 bg-tertiary-container border border-tertiary rounded-xl flex items-start">
                <div className="w-5 h-5 text-tertiary mr-2 flex-shrink-0 mt-0.5">✓</div>
                <span className="text-on-tertiary-container">
                  {successMessage}
                </span>
              </div>
            )}
            
            {/* Error message */}
            {(error || authError) && (
              <div className="mb-6 p-3 bg-error-container border border-error rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 text-error mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-on-error-container">
                  {error || authError}
                </span>
              </div>
            )}
            
            {/* User information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-on-surface mb-4">
                Account Information
              </h2>
              <div className="flex items-center space-x-3 text-on-surface-variant mb-2">
                <Mail className="w-5 h-5 text-on-surface-variant" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-on-surface-variant mb-2">
                <User className="w-5 h-5 text-on-surface-variant" />
                <span>{profile?.full_name || 'Not set'}</span>
              </div>
              {profile?.location && (
                <div className="flex items-center space-x-3 text-on-surface-variant mb-2">
                  <MapPin className="w-5 h-5 text-on-surface-variant" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.company && (
                <div className="flex items-center space-x-3 text-on-surface-variant mb-2">
                  <Briefcase className="w-5 h-5 text-on-surface-variant" />
                  <span>{profile.company}{profile.job_title ? ` • ${profile.job_title}` : ''}</span>
                </div>
              )}
              {profile?.updated_at && (
                <div className="mt-2 text-sm text-on-surface-variant">
                  Last updated: {new Date(profile.updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {/* Edit profile form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-on-surface mb-4">
                  Edit Profile
                </h2>
                
                {/* Tabs */}
                <div className="flex border-b border-outline-variant mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'basic' 
                      ? 'text-on-surface border-b-2 border-primary' 
                      : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    Basic Information
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'contact' 
                      ? 'text-on-surface border-b-2 border-primary' 
                      : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    Contact Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('work')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'work' 
                      ? 'text-on-surface border-b-2 border-primary' 
                      : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    Work & Bio
                  </button>
                </div>
              </div>
              
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-on-surface-variant mb-1">
                      Full Name
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
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-on-surface-variant mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-on-surface-variant" />
                      </div>
                      <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
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
                    <label htmlFor="phone" className="block text-sm font-medium text-on-surface-variant mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-on-surface-variant" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-on-surface-variant mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-on-surface-variant" />
                      </div>
                      <input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
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
                    <label htmlFor="company" className="block text-sm font-medium text-on-surface-variant mb-1">
                      Company
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-on-surface-variant" />
                      </div>
                      <input
                        id="company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                        placeholder="Your company"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-on-surface-variant mb-1">
                      Job Title
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-on-surface-variant" />
                      </div>
                      <input
                        id="jobTitle"
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                        placeholder="Your job title"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-on-surface-variant mb-1">
                      Bio
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <FileText className="h-5 w-5 text-on-surface-variant" />
                      </div>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="pl-10 w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
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
