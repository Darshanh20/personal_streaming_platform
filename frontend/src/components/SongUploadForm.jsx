import { useState } from 'react';

export default function SongUploadForm({ onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    tags: '',
  });
  const [files, setFiles] = useState({
    audio: null,
    lyrics: null,
    cover: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: uploadedFiles[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.duration) {
        throw new Error('Duration is required');
      }
      if (!files.audio) {
        throw new Error('Audio file is required');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('tags', formData.tags);
      
      if (files.audio) formDataToSend.append('audio', files.audio);
      if (files.lyrics) formDataToSend.append('lyrics', files.lyrics);
      if (files.cover) formDataToSend.append('cover', files.cover);

      const response = await fetch('http://localhost:5000/api/admin/upload', {
        method: 'POST',
        headers: {
          'x-admin-key': 'your-super-secret-admin-key-123',
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(`✅ ${data.data.title} uploaded successfully!`);
      setFormData({ title: '', description: '', duration: '', tags: '' });
      setFiles({ audio: null, lyrics: null, cover: null });
      
      // Reset file inputs
      document.querySelectorAll('input[type="file"]').forEach(input => {
        input.value = '';
      });

      if (onUploadSuccess) {
        onUploadSuccess(data.data);
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🎵 Upload New Song</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Song Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleTextChange}
            placeholder="Enter song title"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleTextChange}
            placeholder="Enter song description"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Duration (seconds) *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleTextChange}
            placeholder="240"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Tags (comma-separated, Optional)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleTextChange}
            placeholder="rap,hiphop,2024"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Audio File */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Audio File (MP3 or WAV) *
          </label>
          <input
            type="file"
            name="audio"
            onChange={handleFileChange}
            accept="audio/mpeg,audio/wav,audio/mp3,audio/x-wav"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            required
          />
          {files.audio && <p className="text-sm text-green-600 mt-1">✅ {files.audio.name}</p>}
        </div>

        {/* Lyrics File */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Lyrics File (TXT, Optional)
          </label>
          <input
            type="file"
            name="lyrics"
            onChange={handleFileChange}
            accept=".txt,text/plain"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
          {files.lyrics && <p className="text-sm text-green-600 mt-1">✅ {files.lyrics.name}</p>}
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Cover Art (JPG, PNG, WebP, Optional)
          </label>
          <input
            type="file"
            name="cover"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
          {files.cover && <p className="text-sm text-green-600 mt-1">✅ {files.cover.name}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-bold transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? '📤 Uploading...' : '🚀 Upload Song'}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        * Required fields
      </p>
    </div>
  );
}
