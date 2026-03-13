import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Business } from '../../types/business';
import { useAuth } from '../../context/AuthContext';
import { getBusinessCategories } from '../../api/businesses';
import { useBusinessPermissions } from '../../hooks/useBusinessPermissions';

type ToastState = { type: 'success' | 'error'; message: string } | null;

type BusinessEditFormProps = {
  business: Business;
  onUpdated: (business: Business) => void;
};

const hourDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function BusinessEditForm({ business, onUpdated }: BusinessEditFormProps) {
  const { user } = useAuth();
  const permissions = useBusinessPermissions(business.subscription_tier);
  const categories = useMemo(() => getBusinessCategories(), []);

  const [toast, setToast] = useState<ToastState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(() => ({
    name: business.name || '',
    category: business.category || '',
    description: business.description || '',
    address: business.address || '',
    phone: business.phone || '',
    email: business.email || '',
    website: business.website || '',
    hours: business.hours || {},
    social_media: {
      facebook: business.social_media?.facebook || '',
      twitter: business.social_media?.twitter || '',
      instagram: business.social_media?.instagram || '',
    },
    amenities: business.amenities || [],
    services: business.services || [],
  }));

  const [newAmenity, setNewAmenity] = useState('');
  const [newService, setNewService] = useState('');

  useEffect(() => {
    setFormData({
      name: business.name || '',
      category: business.category || '',
      description: business.description || '',
      address: business.address || '',
      phone: business.phone || '',
      email: business.email || '',
      website: business.website || '',
      hours: business.hours || {},
      social_media: {
        facebook: business.social_media?.facebook || '',
        twitter: business.social_media?.twitter || '',
        instagram: business.social_media?.instagram || '',
      },
      amenities: business.amenities || [],
      services: business.services || [],
    });
  }, [business]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (platform: 'facebook' | 'twitter' | 'instagram', value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value,
      },
    }));
  };

  const handleHoursChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: value,
      },
    }));
  };

  const addAmenity = () => {
    if (!newAmenity.trim()) return;
    if (formData.amenities.includes(newAmenity.trim())) return;
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, newAmenity.trim()],
    }));
    setNewAmenity('');
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(item => item !== amenity),
    }));
  };

  const addService = () => {
    if (!newService.trim()) return;
    if (formData.services.includes(newService.trim())) return;
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService.trim()],
    }));
    setNewService('');
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(item => item !== service),
    }));
  };

  const buildSocialPayload = () => {
    const entries = Object.entries(formData.social_media)
      .map(([key, value]) => [key, value.trim()])
      .filter(([, value]) => value);
    return entries.length ? Object.fromEntries(entries) : {};
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      setToast({ type: 'error', message: 'You must be signed in to update your business.' });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || null,
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        hours: formData.hours,
        social_media: buildSocialPayload(),
        amenities: formData.amenities,
        services: formData.services,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('businesses')
        .update(payload)
        .eq('id', business.id)
        .eq('owner_id', user.id)
        .select('*')
        .single();

      if (error || !data) {
        throw new Error(error?.message || 'Unable to update business profile');
      }

      onUpdated(data as Business);
      setToast({ type: 'success', message: 'Business profile updated.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to update business profile';
      setToast({ type: 'error', message });
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-outline bg-surface px-4 py-3 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary transition-colors';

  const textareaClass =
    'w-full rounded-xl border border-outline bg-surface px-4 py-3 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary transition-colors';

  const basicNotice = (
    <p className="mt-1 text-xs text-on-surface-variant">Upgrade to Premium to edit this field.</p>
  );

  return (
    <div className="relative">
      {toast && (
        <div
          className={`absolute right-0 top-0 z-10 rounded-xl border px-4 py-3 text-sm shadow-lg transition-all ${
            toast.type === 'success'
              ? 'bg-tertiary-container text-on-tertiary-container border-tertiary/30'
              : 'bg-error-container text-on-error-container border-error/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Business Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={inputClass}
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={textareaClass}
              disabled={!permissions.canShowDescription}
            />
            {!permissions.canShowDescription && basicNotice}
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className={inputClass}
              disabled={!permissions.canShowWebsite}
            />
            {!permissions.canShowWebsite && basicNotice}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Facebook</label>
            <input
              type="url"
              value={formData.social_media.facebook}
              onChange={event => handleSocialChange('facebook', event.target.value)}
              className={inputClass}
              disabled={!permissions.canShowSocial}
              placeholder="https://facebook.com/yourpage"
            />
            {!permissions.canShowSocial && basicNotice}
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Twitter</label>
            <input
              type="url"
              value={formData.social_media.twitter}
              onChange={event => handleSocialChange('twitter', event.target.value)}
              className={inputClass}
              disabled={!permissions.canShowSocial}
              placeholder="https://twitter.com/yourhandle"
            />
            {!permissions.canShowSocial && basicNotice}
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Instagram</label>
            <input
              type="url"
              value={formData.social_media.instagram}
              onChange={event => handleSocialChange('instagram', event.target.value)}
              className={inputClass}
              disabled={!permissions.canShowSocial}
              placeholder="https://instagram.com/yourhandle"
            />
            {!permissions.canShowSocial && basicNotice}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Business Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hourDays.map(day => (
              <div key={day}>
                <label className="block text-sm font-medium text-on-surface mb-1">{day}</label>
                <input
                  type="text"
                  value={formData.hours[day] || ''}
                  onChange={event => handleHoursChange(day, event.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Amenities</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={event => setNewAmenity(event.target.value)}
                className={inputClass}
                placeholder="Add amenity"
                disabled={!permissions.canShowAmenities}
              />
              <button
                type="button"
                onClick={addAmenity}
                className="btn-primary"
                disabled={!permissions.canShowAmenities}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {!permissions.canShowAmenities && basicNotice}
            <div className="mt-4 flex flex-wrap gap-2">
              {formData.amenities.map(amenity => (
                <span
                  key={amenity}
                  className="inline-flex items-center rounded-full bg-surface-container-high px-3 py-1 text-sm text-on-surface-variant"
                >
                  {amenity}
                  {permissions.canShowAmenities && (
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 text-on-surface-variant hover:text-on-surface"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Services</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newService}
                onChange={event => setNewService(event.target.value)}
                className={inputClass}
                placeholder="Add service"
                disabled={!permissions.canShowServices}
              />
              <button
                type="button"
                onClick={addService}
                className="btn-primary"
                disabled={!permissions.canShowServices}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {!permissions.canShowServices && basicNotice}
            <div className="mt-4 flex flex-wrap gap-2">
              {formData.services.map(service => (
                <span
                  key={service}
                  className="inline-flex items-center rounded-full bg-surface-container-high px-3 py-1 text-sm text-on-surface-variant"
                >
                  {service}
                  {permissions.canShowServices && (
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      className="ml-2 text-on-surface-variant hover:text-on-surface"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
