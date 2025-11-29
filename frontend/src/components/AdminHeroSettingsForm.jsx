import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminHeroSettingsForm({ onSuccess }) {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    heroImageFile: null,
    imageUrl: '',
    heading: 'Welcome to My Music.',
    subheading: 'Exclusive tracks, lyrics, and stories — experience a world of original music, crafted with emotion and depth.',
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/hero`);
      const data = await response.json();

      if (data.success && data.data) {
        setHeroData(data.data);
        setFormData({
          heroImageFile: null,
          imageUrl: data.data.imageUrl || '',
          heading: data.data.heading || 'Welcome to My Music.',
          subheading: data.data.subheading || 'Exclusive tracks, lyrics, and stories',
        });
        setPreview(data.data.imageUrl);
      }
    } catch (err) {
      console.error('Error fetching hero data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        heroImageFile: file,
      }));

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
      if (!formData.heroImageFile && !heroData) {
        throw new Error('Please select a hero image');
      }

      const formDataToSend = new FormData();

      if (formData.heroImageFile) {
        formDataToSend.append('heroImage', formData.heroImageFile);
      }

      // Send only editable fields
      formDataToSend.append('heading', formData.heading);
      formDataToSend.append('subheading', formData.subheading);
      
      // Send defaults for other fields (not editable)
      formDataToSend.append('overlayColor', '#000000');
      formDataToSend.append('overlayOpacity', 0.65);
      formDataToSend.append('primaryBtnText', 'Listen Now');
      formDataToSend.append('primaryBtnLink', '/songs');
      formDataToSend.append('secondaryBtnText', 'View Lyrics');
      formDataToSend.append('secondaryBtnLink', '/lyrics');
      formDataToSend.append('textColor', 'white');
      formDataToSend.append('textShadow', false);
      formDataToSend.append('imageFit', 'contain');
      formDataToSend.append('blur', 0);
      formDataToSend.append('brightness', 1);
      formDataToSend.append('contrast', 1);
      formDataToSend.append('imageOpacity', 1);
      formDataToSend.append('enabled', true);

      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (!adminKey) {
        throw new Error('Admin key not configured');
      }

      let response;
      if (heroData && !formData.heroImageFile) {
        // Update existing (without new image)
        response = await fetch(`${API_URL}/hero/${heroData.id}`, {
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
        throw new Error(data.error || 'Failed to save hero settings');
      }

      const result = await response.json();
      setHeroData(result.data);
      setFormData((prev) => ({
        ...prev,
        heroImageFile: null,
      }));

      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to save hero settings');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!heroData) return;

    if (!window.confirm('Are you sure you want to delete the hero section?')) {
      return;
    }

    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      const response = await fetch(`${API_URL}/hero/${heroData.id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete hero section');
      }

      setHeroData(null);
      setPreview(null);
      setFormData({
        heroImageFile: null,
        imageUrl: '',
        heading: 'Welcome to My Music.',
        subheading: 'Exclusive tracks, lyrics, and stories',
      });

      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to delete hero section');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-950 border border-gray-800 p-8">
        <p className="text-gray-400">Loading hero settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="mb-8">
        <p className="text-gray-400 text-sm">Customize the hero banner on the home page</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* LIVE PREVIEW */}
        {preview && (
          <div className="bg-gray-950 border border-gray-800 p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4 text-sm">📺 PREVIEW</h3>
            <div className="border border-gray-700 rounded-sm overflow-hidden bg-black">
              <div className="relative min-h-64 bg-black flex items-center justify-center text-center">
                {/* Background Image */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('${preview}')`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/65" />
                {/* Content */}
                <div className="relative z-10 px-6 text-center">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">{formData.heading}</h1>
                  <p className="text-base md:text-lg text-gray-200">{formData.subheading}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FORM FIELDS */}
        <div className="space-y-6 bg-gray-950 border border-gray-800 p-6 rounded-lg">
          {/* Image Upload */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">
              Hero Image {heroData ? '(Optional)' : '(Required)'}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white file:bg-gray-800 file:text-white file:border-0 file:px-3 file:py-2 file:cursor-pointer hover:file:bg-gray-700 transition-colors duration-300 rounded"
            />
            {formData.heroImageFile && (
              <p className="text-xs text-green-400 mt-2">✓ {formData.heroImageFile.name}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">Landscape orientation recommended</p>
          </div>

          {/* Heading */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Main Heading</label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              placeholder="e.g., Welcome to My Music."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors duration-300 rounded"
            />
          </div>

          {/* Subheading */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Subheading</label>
            <textarea
              name="subheading"
              value={formData.subheading}
              onChange={handleInputChange}
              placeholder="Describe your music or platform..."
              rows="3"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors duration-300 rounded resize-none"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 py-3 font-semibold rounded transition-all duration-300 ${
              submitting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {submitting ? 'Saving...' : heroData ? '💾 Update' : '✨ Create'}
          </button>

          {heroData && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 font-semibold text-red-500 bg-transparent border border-red-700 hover:border-red-600 hover:bg-red-900/20 transition-all duration-300 rounded"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </form>

      {heroData && (
        <div className="bg-green-900/20 border border-green-700 p-6 rounded text-green-200 text-sm">
          ✅ <strong>Hero section is active.</strong> Changes are live on the home page.
        </div>
      )}

      <style>{`
        /* Scrollbar styling */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
      `}</style>
    </div>
  );
}
