import React, { useState } from 'react';
import { useBusinesses } from '../context/BusinessContext';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Building2, 
  FileImage,
  Tag,
  Info,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { Business } from '../types/business';
import { submitBusiness, getBusinessCategories } from '../api/businesses';

export function BusinessProfileCreation() {
  const navigate = useNavigate();
  const categories = getBusinessCategories();
  const { addBusiness } = useBusinesses();
  
  // Form state
  const [formData, setFormData] = useState<Omit<Business, 'id'>>({
    name: '',
    category: '',
    rating: 0, // Will be calculated later based on reviews
    address: '',
    phone: '',
    website: '',
    image: '',
    description: '',
    hours: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 5:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 5:00 PM',
      Saturday: 'Closed',
      Sunday: 'Closed'
    },
    amenities: []
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Amenities management
  const [newAmenity, setNewAmenity] = useState('');
  
  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle business hours changes
  const handleHoursChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: value
      }
    }));
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload this to a server and get a URL back
      // For now, we'll create a local object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      // In a real implementation, we would upload the image and get a URL
      // For this demo, we'll just use the object URL
      setFormData(prev => ({
        ...prev,
        image: objectUrl
      }));
    }
  };
  
  // Add a new amenity
  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };
  
  // Remove an amenity
  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      const requiredFields = ['name', 'category', 'address', 'phone', 'description'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      }
      
      if (!formData.image) {
        throw new Error('Please upload a business photo');
      }
      
      // Submit the form data
      const result = await submitBusiness(formData);
      console.log('Business created:', result);
      
      // Add the new business to the context for optimistic updates
      addBusiness(result);
      
      // Show success message
      setSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate(`/businesses/${result.id}`);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your business profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <button
          onClick={() => navigate('/businesses')}
          className="flex items-center text-on-surface-variant hover:text-primary mb-6 transition-colors duration-[var(--md-sys-motion-duration-short3)]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Businesses
        </button>
        
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display font-bold text-on-surface mb-4">
            Add Your Business
          </h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Join the California City business directory and connect with local residents and visitors. 
            Complete the form below to create your free business listing.
          </p>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="card mb-8 bg-tertiary-container border border-tertiary text-on-tertiary-container">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-tertiary-container rounded-full p-2 mr-3">
                <svg className="h-5 w-5 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Business profile created successfully!</h3>
                <p className="text-sm">Redirecting you to your business page...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="card mb-8 bg-error-container border border-error text-on-error-container">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-error-container rounded-full p-2 mr-3">
                <svg className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Building2 className="w-5 h-5 text-on-surface-variant mr-2" />
                Business Information
              </h2>
              
              <div className="space-y-6">
                {/* Business Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-on-surface-variant mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                {/* Business Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-on-surface-variant mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Business Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-on-surface-variant mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    required
                  />
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Describe your business, services, and what makes it unique (200-500 characters recommended).
                  </p>
                </div>
                
                {/* Business Photo */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-on-surface-variant mb-1">
                    Business Photo *
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-outline-variant rounded-xl cursor-pointer bg-surface-container-high hover:bg-surface-container transition-colors duration-[var(--md-sys-motion-duration-short3)]">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileImage className="w-8 h-8 text-on-surface-variant mb-2" />
                        <p className="text-xs text-on-surface-variant text-center">
                          Click to upload
                        </p>
                      </div>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    
                    {imagePreview && (
                      <div className="relative w-32 h-32">
                        <img
                          src={imagePreview}
                          alt="Business preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute -top-2 -right-2 bg-error text-on-error rounded-full p-1"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Upload a high-quality image that represents your business (storefront, logo, etc.)
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Information Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Info className="w-5 h-5 text-on-surface-variant mr-2" />
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-on-surface-variant mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-on-surface-variant mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-on-surface-variant mb-1">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="www.yourbusiness.com"
                    className="w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                  />
                </div>
                
                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Amenities
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Add an amenity (e.g., Wi-Fi, Parking)"
                      className="flex-grow rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={addAmenity}
                      className="px-3 py-2 bg-secondary-container text-on-secondary-container rounded-full hover:opacity-90 transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.amenities.map(amenity => (
                        <div
                          key={amenity}
                          className="flex items-center bg-secondary-container text-on-secondary-container px-3 py-1 rounded-lg text-sm"
                        >
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className="ml-2 text-on-secondary-container hover:text-on-secondary-container"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Business Hours Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Clock className="w-5 h-5 text-on-surface-variant mr-2" />
              Business Hours
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(formData.hours).map(([day, hours]) => (
                <div key={day}>
                  <label htmlFor={`hours-${day}`} className="block text-sm font-medium text-on-surface-variant mb-1">
                    {day}
                  </label>
                  <input
                    type="text"
                    id={`hours-${day}`}
                    value={hours}
                    onChange={(e) => handleHoursChange(day, e.target.value)}
                    placeholder="9:00 AM - 5:00 PM"
                    className="w-full rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-8 py-3 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Business Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
