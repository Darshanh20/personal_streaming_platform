import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminSongUploadForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    songUrl: '',
    tags: '',
    audioFile: null,
    coverImage: null,
    lyricsFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }

      if (!formData.audioFile) {
        throw new Error('Audio file is required');
      }

      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.songUrl) {
        formDataToSend.append('songUrl', formData.songUrl);
      }
      if (formData.tags) {
        formDataToSend.append('tags', formData.tags);
      }
      formDataToSend.append('audio', formData.audioFile);
      
      if (formData.coverImage) {
        formDataToSend.append('cover', formData.coverImage);
      }

      if (formData.lyricsFile) {
        formDataToSend.append('lyrics', formData.lyricsFile);
      }

      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (!adminKey) {
        throw new Error('Admin key not configured');
      }

      const response = await fetch(`${API_URL}/admin/upload`, {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload song');
      }

      // Reset form on success
      setFormData({
        title: '',
        description: '',
        songUrl: '',
        tags: '',
        audioFile: null,
        coverImage: null,
        lyricsFile: null,
      });

      // Call parent callback to refresh songs list
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to upload song');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 cursor-pointer">Add New Song</h2>
        <p className="text-gray-400 text-sm cursor-pointer">Upload a new track to your collection</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-gray-950 border border-gray-800 p-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 cursor-pointer">
            ❌ {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">Song Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter song title"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition-colors duration-300"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add song description"
            rows="3"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition-colors duration-300 resize-none"
          />
        </div>

        {/* Song URL */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">Song URL (YouTube, Spotify, etc.)</label>
          <input
            type="url"
            name="songUrl"
            value={formData.songUrl}
            onChange={handleInputChange}
            placeholder="e.g., https://youtube.com/watch?v=... or https://open.spotify.com/track/..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition-colors duration-300"
          />
          {formData.songUrl && (
            <p className="text-xs text-gray-400 mt-2 cursor-pointer">✓ URL added</p>
          )}
        </div>

        {/* Audio File */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">Audio File</label>
          <input
            type="file"
            name="audioFile"
            onChange={handleFileChange}
            accept="audio/*"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white file:bg-gray-800 file:text-white file:border-0 file:px-3 file:py-2 file:cursor-pointer hover:file:bg-gray-700 transition-colors duration-300"
            required
          />
          {formData.audioFile && (
            <p className="text-xs text-gray-400 mt-2 cursor-pointer">✓ {formData.audioFile.name}</p>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">Cover Image</label>
          <input
            type="file"
            name="coverImage"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white file:bg-gray-800 file:text-white file:border-0 file:px-3 file:py-2 file:cursor-pointer hover:file:bg-gray-700 transition-colors duration-300"
          />
          {formData.coverImage && (
            <p className="text-xs text-gray-400 mt-2 cursor-pointer">✓ {formData.coverImage.name}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., rock, indie, alternative"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition-colors duration-300"
          />
          {formData.tags && (
            <p className="text-xs text-gray-400 mt-2 cursor-pointer">
              ✓ Tags: {formData.tags.split(',').map(tag => tag.trim()).filter(t => t).join(', ')}
            </p>
          )}
        </div>

        {/* Lyrics File */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">Lyrics (TXT file)</label>
          <input
            type="file"
            name="lyricsFile"
            onChange={handleFileChange}
            accept=".txt,text/plain"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white file:bg-gray-800 file:text-white file:border-0 file:px-3 file:py-2 file:cursor-pointer hover:file:bg-gray-700 transition-colors duration-300"
          />
          {formData.lyricsFile && (
            <p className="text-xs text-gray-400 mt-2 cursor-pointer">✓ {formData.lyricsFile.name}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold transition-all duration-300 ${
              loading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100 cursor-pointer'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload Song'}
          </button>
        </div>
      </form>

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
