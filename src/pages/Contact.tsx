import React from 'react';
import ContactForm from '../components/ContactForm';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white fade-in">
            Contact Us
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Have questions about our services or want to get in touch? Fill out the form below and we'll get back to you as soon as possible. Questions about California City? Reach out to City Hall, contact info below.
          </p>
          <ContactForm />
          
          {/* Contact Information Section */}
          <div className="mt-16 max-w-xl mx-auto">
            <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg transition-colors duration-200">
              <p className="text-center mb-6 text-gray-800 dark:text-gray-200">
                Have questions about California City? Reach out to City Hall!
              </p>
              <div className="space-y-4 text-center text-gray-800 dark:text-gray-200">
                <p>City Hall: (760) 373-8661</p>
                <p>21000 Hacienda Blvd</p>
                <p>California City, CA 93505</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
