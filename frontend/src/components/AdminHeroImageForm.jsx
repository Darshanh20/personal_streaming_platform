import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminHeroImageForm({ onSuccess }) {
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    heroImageFile: null,
    title: '',
    objectFit: 'cover',
    opacity: 1,
    blur: 0,
    brightness: 1,
    contrast: 1,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchHeroImage();
  }, []);

  const fetchHeroImage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/hero`);
      const data = await response.json();

      if (data.success && data.data) {
        setHeroImage(data.data);
        setFormData({
          heroImageFile: null,
          title: data.data.title || '',
          objectFit: data.data.objectFit || 'cover',
          opacity: data.data.opacity || 1,
          blur: data.data.blur || 0,
          brightness: data.data.brightness || 1,
          contrast: data.data.contrast || 1,
        });
        setPreview(data.data.imageUrl);
      }
    } catch (err) {
      console.error('Error fetching hero image:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'opacity' || name === 'brightness' || name === 'contrast' 
        ? parseFloat(value) 
        : name === 'blur' 
        ? parseInt(value, 10)
        : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        heroImageFile: file,
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!formData.heroImageFile && !heroImage) {
        throw new Error('Please select a hero image');
      }

      const formDataToSend = new FormData();

      if (formData.heroImageFile) {
        formDataToSend.append('heroImage', formData.heroImageFile);
      }

      formDataToSend.append('title', formData.title);
      formDataToSend.append('objectFit', formData.objectFit);
      formDataToSend.append('opacity', formData.opacity);
      formDataToSend.append('blur', formData.blur);
      formDataToSend.append('brightness', formData.brightness);
      formDataToSend.append('contrast', formData.contrast);

      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (!adminKey) {
        throw new Error('Admin key not configured');
      }

      let response;
      if (heroImage && !formData.heroImageFile) {
        // Update existing (without new image)
        response = await fetch(`${API_URL}/hero/${heroImage.id}`, {
          method: 'PUT',
          headers: {
            'x-admin-key': adminKey,
          },
          body: formDataToSend,
        });
      } else {
        // Create new
        response = await fetch(`${API_URL}/hero`, {
          method: 'POST',
          headers: {
            'x-admin-key': adminKey,
          },
          body: formDataToSend,
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save hero image');
      }

      const result = await response.json();
      setHeroImage(result.data);
      setFormData((prev) => ({
        ...prev,
        heroImageFile: null,
      }));
      
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to save hero image');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!heroImage) return;

    if (!window.confirm('Are you sure you want to delete the hero image?')) {
      return;
    }

    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      const response = await fetch(`${API_URL}/hero/${heroImage.id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete hero image');
      }

      setHeroImage(null);
      setPreview(null);
      setFormData({
        heroImageFile: null,
        title: '',
        objectFit: 'cover',
        opacity: 1,
        blur: 0,
        brightness: 1,
        contrast: 1,
      });
      
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to delete hero image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Hero Banner Image</h2>
        <p className="text-gray-400 text-sm">Manage the landing page hero/cover image</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-gray-950 border border-gray-800 p-8">
        {/* Preview */}
        {preview && (
          <div className="space-y-2">
            <label className="block text-white font-semibold text-sm">Preview</label>
            <div 
              className="w-full h-48 bg-gray-900 border border-gray-800 relative overflow-hidden"
              style={{
                backgroundImage: `url('${preview}')`,
                backgroundSize: formData.objectFit,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: formData.opacity,
                filter: `blur(${formData.blur}px) brightness(${formData.brightness}) contrast(${formData.contrast})`,
              }}
            />
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm">
            Hero Image {heroImage ? '(Optional - leave empty to keep current)' : '(Required)'}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white file:bg-gray-800 file:text-white file:border-0 file:px-3 file:py-2 file:cursor-pointer hover:file:bg-gray-700 transition-colors duration-300"
          />
          {formData.heroImageFile && (
            <p className="text-xs text-gray-400 mt-2">✓ {formData.heroImageFile.name}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">Recommended: High-quality images work best. Landscape orientation preferred.</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm">Title (Optional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Optional title for the hero image"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition-colors duration-300"
          />
        </div>

        {/* Styling Options */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-white font-semibold mb-4 text-sm">Image Styling</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Object Fit */}
            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">How to fit image</label>
              <select
                name="objectFit"
                value={formData.objectFit}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gray-700 transition-colors duration-300"
              >
                <option value="cover">Cover (Crop to fill)</option>
                <option value="contain">Contain (Show entire image)</option>
                <option value="fill">Fill (Stretch to fit)</option>
                <option value="scale-down">Scale Down</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">cover = good for responsive, contain = no cropping</p>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                Opacity: {formData.opacity.toFixed(1)}
              </label>
              <input
                type="range"
                name="opacity"
                min="0"
                max="1"
                step="0.1"
                value={formData.opacity}
                onChange={handleInputChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">0 = invisible, 1 = fully visible</p>
            </div>

            {/* Blur */}
            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                Blur: {formData.blur}px
              </label>
              <input
                type="range"
                name="blur"
                min="0"
                max="20"
                step="1"
                value={formData.blur}
                onChange={handleInputChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Blur effect strength</p>
            </div>

            {/* Brightness */}
            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                Brightness: {formData.brightness.toFixed(1)}x
              </label>
              <input
                type="range"
                name="brightness"
                min="0"
                max="2"
                step="0.1"
                value={formData.brightness}
                onChange={handleInputChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">0.5 = darker, 1 = normal, 2 = brighter</p>
            </div>

            {/* Contrast */}
            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                Contrast: {formData.contrast.toFixed(1)}x
              </label>
              <input
                type="range"
                name="contrast"
                min="0"
                max="2"
                step="0.1"
                value={formData.contrast}
                onChange={handleInputChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">1 = normal, higher = more contrast</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-800">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 py-3 font-semibold transition-all duration-300 ${
              submitting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {submitting ? 'Saving...' : heroImage ? 'Update Settings' : 'Upload Hero Image'}
          </button>

          {heroImage && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 font-semibold text-red-500 bg-transparent border border-red-700 hover:border-red-600 hover:bg-red-900 hover:bg-opacity-20 transition-all duration-300"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </form>

      {heroImage && (
        <div className="bg-gray-950 border border-gray-800 p-6">
          <p className="text-gray-300 text-sm">
            ✅ <strong>Hero image active.</strong> Visitors will see this image on the landing page hero section.
          </p>
        </div>
      )}
    </div>
  );
}
