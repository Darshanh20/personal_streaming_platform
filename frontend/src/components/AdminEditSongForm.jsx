import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminEditSongForm({ song, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    songUrl: '',
  });

  const [files, setFiles] = useState({
    audioFile: null,
    coverImage: null,
    lyricsFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title || '',
        description: song.description || '',
        songUrl: song.songUrl || '',
      });
    }
  }, [song]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: uploadedFiles[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.songUrl) formDataToSend.append('songUrl', formData.songUrl);

      if (files.audioFile) formDataToSend.append('audio', files.audioFile);
      if (files.coverImage) formDataToSend.append('cover', files.coverImage);
      if (files.lyricsFile) formDataToSend.append('lyrics', files.lyricsFile);

      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (!adminKey) {
        throw new Error('Admin key not configured');
      }

      const response = await fetch(`${API_URL}/admin/songs/${song.id}`, {
        method: 'PUT',
        headers: {
          'x-admin-key': adminKey,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update song');
      }

      const result = await response.json();
      onSave(result.data);
    } catch (err) {
      setError(err.message || 'Failed to update song');
    } finally {
      setLoading(false);
    }
  };

  if (!song) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-950 border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-950 border-b border-gray-800 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white cursor-pointer">Edit Song</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white text-2xl cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter song description"
              rows="4"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition-colors duration-300 resize-none"
            />
          </div>

          {/* Song URL */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">Song URL (Optional)</label>
            <input
              type="url"
              name="songUrl"
              value={formData.songUrl}
              onChange={handleInputChange}
              placeholder="e.g., https://youtube.com/watch?v=... or https://open.spotify.com/track/..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition-colors duration-300"
            />
            {formData.songUrl && (
              <p className="text-xs text-green-400 mt-2 cursor-pointer">✓ URL added</p>
            )}
          </div>

          {/* Lyrics File */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">
              Lyrics File (Optional - leave empty to keep current)
            </label>
            <input
              type="file"
              name="lyricsFile"
              onChange={handleFileChange}
              accept=".txt,text/plain"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white file:bg-gray-800 file:text-white file:border-0 file:px-3 file:py-2 file:cursor-pointer hover:file:bg-gray-700 transition-colors duration-300"
            />
            {files.lyricsFile && (
              <p className="text-xs text-gray-400 mt-2 cursor-pointer">✓ {files.lyricsFile.name}</p>
            )}
          </div>

          {/* Audio File */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">
              Audio File (Optional - leave empty to keep current)
            </label>
            <input
              type="file"
              name="audioFile"
              onChange={handleFileChange}
              accept="audio/*"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white file:bg-gray-800 file:text-white file:border-0 file:px-3 file:py-2 file:cursor-pointer hover:file:bg-gray-700 transition-colors duration-300"
            />
            {files.audioFile && (
              <p className="text-xs text-gray-400 mt-2 cursor-pointer">✓ {files.audioFile.name}</p>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm cursor-pointer">
              Cover Image (Optional - leave empty to keep current)
            </label>
            <input
              type="file"
              name="coverImage"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white file:bg-gray-800 file:text-white file:border-0 file:px-3 file:py-2 file:cursor-pointer hover:file:bg-gray-700 transition-colors duration-300"
            />
            {files.coverImage && (
              <p className="text-xs text-gray-400 mt-2 cursor-pointer">✓ {files.coverImage.name}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-800">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 font-semibold transition-all duration-300 ${
                loading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-100 cursor-pointer'
              }`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 font-semibold text-white bg-transparent border border-gray-800 hover:border-gray-600 transition-all duration-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
