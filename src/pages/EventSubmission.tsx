import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileImage, 
  Tag, 
  Mail, 
  Phone, 
  User,
  Info,
  ArrowLeft
} from 'lucide-react';
import { Event } from '../types/event';
import { submitEvent, getEventCategories, getCurrentDate, getOneYearFromNow } from '../api/events';
import { clsx } from 'clsx';

export function EventSubmission() {
  const navigate = useNavigate();
  const categories = getEventCategories();
  const minDate = getCurrentDate();
  const maxDate = getOneYearFromNow();
  
  // Form state
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    date: minDate,
    time: '',
    location: '',
    description: '',
    image: '',
    category: '',
    tags: [],
    organizer: {
      name: '',
      email: '',
      phone: ''
    }
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Tag management
  const [newTag, setNewTag] = useState('');
  
  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested organizer fields
    if (name.startsWith('organizer.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        organizer: {
          ...prev.organizer,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
  
  // Add a new tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  // Remove a tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      const requiredFields = ['title', 'date', 'time', 'location', 'description', 'category'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      }
      
      if (!formData.image) {
        throw new Error('Please upload an event image');
      }
      
      // Validate organizer information
      const requiredOrganizerFields = ['name', 'email', 'phone'];
      const missingOrganizerFields = requiredOrganizerFields.filter(
        field => !formData.organizer[field as keyof typeof formData.organizer]
      );
      
      if (missingOrganizerFields.length > 0) {
        throw new Error(`Please fill in the following organizer fields: ${missingOrganizerFields.join(', ')}`);
      }
      
      // Submit the form data
      const result = await submitEvent(formData);
      console.log('Event created:', result);
      
      // Show success message
      setSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate(`/events/${result.id}`);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your event');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50 py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-desert-600 dark:text-desert-400 hover:text-desert-800 dark:hover:text-desert-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>
        
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display font-bold text-desert-800 dark:text-desert-100 mb-4">
            Submit an Event
          </h1>
          <p className="text-desert-600 dark:text-desert-400 max-w-2xl mx-auto">
            Share your event with the California City community. Complete the form below to submit your event for approval.
          </p>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="card mb-8 bg-green-50 border border-green-200 text-green-800">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Event submitted successfully!</h3>
                <p className="text-sm">Redirecting you to your event page...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="card mb-8 bg-red-50 border border-red-200 text-red-800">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            {/* Event Details Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Info className="w-5 h-5 text-desert-400 mr-2" />
                Event Details
              </h2>
              
              <div className="space-y-6">
                {/* Event Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                    required
                  />
                </div>
                
                {/* Event Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
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
                
                {/* Event Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                    required
                  />
                  <p className="mt-1 text-sm text-desert-500 dark:text-desert-500">
                    Provide a detailed description of your event (200-500 characters recommended).
                  </p>
                </div>
                
                {/* Event Image */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                    Event Image *
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-desert-300 dark:border-night-desert-300 rounded-lg cursor-pointer bg-white dark:bg-night-desert-200 hover:bg-desert-50 dark:hover:bg-night-desert-300 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileImage className="w-8 h-8 text-desert-400 mb-2" />
                        <p className="text-xs text-desert-500 dark:text-desert-500 text-center">
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
                          alt="Event preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-desert-500 dark:text-desert-500">
                    Upload a high-quality image that represents your event (poster, banner, etc.)
                  </p>
                </div>
                
                {/* Event Tags */}
                <div>
                  <label className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Tags
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag (e.g., family-friendly, outdoor)"
                      className="flex-grow rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 bg-desert-100 dark:bg-night-desert-300 text-desert-700 dark:text-desert-300 rounded-md hover:bg-desert-200 dark:hover:bg-night-desert-400 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map(tag => (
                        <div
                          key={tag}
                          className="flex items-center bg-desert-100 dark:bg-night-desert-300 text-desert-700 dark:text-desert-300 px-3 py-1 rounded-full"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-desert-500 hover:text-desert-700"
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
            
            {/* Date, Time, and Location Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Calendar className="w-5 h-5 text-desert-400 mr-2" />
                Date, Time & Location
              </h2>
              
              <div className="space-y-6">
                {/* Event Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={minDate}
                    max={maxDate}
                    className="w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                    required
                  />
                </div>
                
                {/* Event Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time *
                  </label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="e.g., 6:00 PM - 9:00 PM"
                    className="w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                    required
                  />
                </div>
                
                {/* Event Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Central Park, California City"
                    className="w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                    required
                  />
                </div>
                
                {/* Organizer Information */}
                <div className="pt-4 border-t border-desert-200 dark:border-night-desert-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="w-4 h-4 text-desert-400 mr-2" />
                    Organizer Information
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Organizer Name */}
                    <div>
                      <label htmlFor="organizer.name" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                        Organizer Name *
                      </label>
                      <input
                        type="text"
                        id="organizer.name"
                        name="organizer.name"
                        value={formData.organizer.name}
                        onChange={handleChange}
                        className="w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                        required
                      />
                    </div>
                    
                    {/* Organizer Email */}
                    <div>
                      <label htmlFor="organizer.email" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        id="organizer.email"
                        name="organizer.email"
                        value={formData.organizer.email}
                        onChange={handleChange}
                        className="w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                        required
                      />
                    </div>
                    
                    {/* Organizer Phone */}
                    <div>
                      <label htmlFor="organizer.phone" className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-1">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="organizer.phone"
                        name="organizer.phone"
                        value={formData.organizer.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className="w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                "btn-primary px-8 py-3 flex items-center",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
