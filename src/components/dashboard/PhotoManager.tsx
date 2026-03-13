import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { ImagePlus, Trash2, UploadCloud } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Business } from '../../types/business';
import { useBusinessPermissions } from '../../hooks/useBusinessPermissions';

type PhotoManagerProps = {
  business: Business;
  onUpdated: (business: Business) => void;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getStoragePathFromUrl(url: string) {
  const marker = '/business-photos/';
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export function PhotoManager({ business, onUpdated }: PhotoManagerProps) {
  const permissions = useBusinessPermissions(business.subscription_tier);
  const inputRef = useRef<HTMLInputElement>(null);
  const [gallery, setGallery] = useState(business.gallery || []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  useEffect(() => {
    setGallery(business.gallery || []);
  }, [business]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const remainingSlots = useMemo(() => {
    return Math.max(permissions.maxPhotos - gallery.length, 0);
  }, [permissions.maxPhotos, gallery.length]);

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, or WebP images are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File must be 2MB or smaller.';
    }
    if (gallery.length >= permissions.maxPhotos) {
      return `Your plan allows up to ${permissions.maxPhotos} photos.`;
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);

    try {
      const path = `${business.id}/${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('business-photos')
        .upload(path, selectedFile, { contentType: selectedFile.type });

      if (uploadError) {
        throw new Error(uploadError.message || 'Upload failed');
      }

      const { data } = supabase.storage.from('business-photos').getPublicUrl(path);
      const url = data.publicUrl;

      const updatedGallery = [...gallery, { url, alt: selectedFile.name }];
      const { data: updatedBusiness, error: updateError } = await supabase
        .from('businesses')
        .update({ gallery: updatedGallery, updated_at: new Date().toISOString() })
        .eq('id', business.id)
        .select('*')
        .single();

      if (updateError || !updatedBusiness) {
        throw new Error(updateError?.message || 'Failed to update gallery');
      }

      setGallery(updatedGallery);
      setSelectedFile(null);
      onUpdated(updatedBusiness as Business);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (url: string) => {
    setDeletingUrl(url);
    setError(null);

    try {
      const path = getStoragePathFromUrl(url);
      if (path) {
        await supabase.storage.from('business-photos').remove([path]);
      }

      const updatedGallery = gallery.filter(photo => photo.url !== url);
      const { data: updatedBusiness, error: updateError } = await supabase
        .from('businesses')
        .update({ gallery: updatedGallery, updated_at: new Date().toISOString() })
        .eq('id', business.id)
        .select('*')
        .single();

      if (updateError || !updatedBusiness) {
        throw new Error(updateError?.message || 'Failed to update gallery');
      }

      setGallery(updatedGallery);
      onUpdated(updatedBusiness as Business);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete photo';
      setError(message);
    } finally {
      setDeletingUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-on-surface">Gallery Photos</h3>
          <p className="text-sm text-on-surface-variant">
            {gallery.length} / {permissions.maxPhotos} photos used. {remainingSlots} slots remaining.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading || remainingSlots === 0}
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Add Photo
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
          {error}
        </div>
      )}

      <div
        className={`rounded-xl border-2 border-dashed p-6 transition-colors ${
          isDragging
            ? 'border-primary bg-primary-container/20'
            : 'border-outline-variant bg-surface-container-low'
        }`}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (remainingSlots === 0) {
            setError(`Your plan allows up to ${permissions.maxPhotos} photos.`);
            return;
          }
          inputRef.current?.click();
        }}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={event => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center gap-2">
          <UploadCloud className="w-8 h-8 text-on-surface-variant" />
          <p className="text-sm text-on-surface-variant">
            Drag and drop a photo here, or click to browse.
          </p>
          <p className="text-xs text-on-surface-variant">JPEG, PNG, WebP • Max 2MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {previewUrl && selectedFile && (
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <img
              src={previewUrl}
              alt={selectedFile.name}
              className="h-32 w-32 rounded-xl object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-on-surface">{selectedFile.name}</p>
              <p className="text-xs text-on-surface-variant">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-primary"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {gallery.length === 0 ? (
        <div className="card text-center text-on-surface-variant">
          No photos yet. Upload your first gallery image.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map(photo => (
            <div key={photo.url} className="relative group rounded-xl overflow-hidden border border-outline-variant">
              <img src={photo.url} alt={photo.alt} className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(photo.url)}
                disabled={deletingUrl === photo.url}
                className="absolute top-3 right-3 rounded-full bg-surface/90 p-2 text-on-surface hover:text-error transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
