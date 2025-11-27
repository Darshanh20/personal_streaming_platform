import { useState } from 'react';

export default function AdminUploadPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

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

  // Handle password verification
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError(null);

    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (!correctPassword) {
      setPasswordError('❌ Admin password not configured in .env');
      return;
    }

    if (adminPassword !== correctPassword) {
      setPasswordError('❌ Incorrect password. Access denied.');
      setAdminPassword('');
      return;
    }

    setAuthenticated(true);
    setAdminPassword('');
  };

  // Handle logout
  const handleLogout = () => {
    setAuthenticated(false);
    setAdminPassword('');
    setFormData({ title: '', description: '', duration: '', tags: '' });
    setFiles({ audio: null, lyrics: null, cover: null });
    setError(null);
    setSuccess(null);
  };

  const handleTextChange = (e) => {
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
    setSuccess(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.duration) {
        throw new Error('Duration is required');
      }
      if (!files.audio) {
        throw new Error('Audio file is required');
      }

      // Build FormData
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('tags', formData.tags);

      if (files.audio) formDataToSend.append('audio', files.audio);
      if (files.lyrics) formDataToSend.append('lyrics', files.lyrics);
      if (files.cover) formDataToSend.append('cover', files.cover);

      // Send request with secret admin key
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (!adminKey) {
        throw new Error('Admin key not configured in .env');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL.replace('/api', '')}/api/admin/upload`,
        {
          method: 'POST',
          headers: {
            'x-admin-key': adminKey,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(`✅ "${data.data.title}" uploaded successfully!`);

      // Clear form
      setFormData({ title: '', description: '', duration: '', tags: '' });
      setFiles({ audio: null, lyrics: null, cover: null });

      // Reset file inputs
      document.querySelectorAll('input[type="file"]').forEach((input) => {
        input.value = '';
      });
    } catch (err) {
      setError(`❌ ${err.message || 'Upload failed'}`);
    } finally {
      setLoading(false);
    }
  };

  // Password Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Lock Icon */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-white mb-2">Secure Access Required</h1>
            <p className="text-gray-400">Enter password to access admin upload</p>
          </div>

          {/* Password Form */}
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-gray-800 border border-gray-700 rounded-lg p-8 space-y-6"
          >
            {/* Error Message */}
            {passwordError && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg">
                {passwordError}
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter your admin password"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition"
            >
              Unlock Admin Panel
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm">
              🔒 <strong>This is a restricted area.</strong> Only authorized administrators can access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Upload Form (After Authentication)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-2xl mx-auto">
        {/* Secret Admin Header with Logout */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🔐 Secret Admin Upload</h1>
            <p className="text-gray-400">Restricted access - requires secret key validation</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900 border border-green-700 text-green-200 px-6 py-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 border border-gray-700 rounded-lg p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Song Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTextChange}
              placeholder="Enter song title"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleTextChange}
              placeholder="Enter song description"
              rows="3"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Duration (seconds) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleTextChange}
              placeholder="240"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Tags (comma-separated, Optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleTextChange}
              placeholder="rap,hiphop,2024"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Audio File */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Audio File (MP3 or WAV) *
            </label>
            <input
              type="file"
              name="audio"
              onChange={handleFileChange}
              accept="audio/*"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-2 file:cursor-pointer hover:file:bg-blue-700"
              required
            />
            {files.audio && (
              <p className="text-sm text-green-400 mt-2">✅ {files.audio.name}</p>
            )}
          </div>

          {/* Lyrics File */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Lyrics File (TXT, Optional)
            </label>
            <input
              type="file"
              name="lyrics"
              onChange={handleFileChange}
              accept=".txt,text/plain"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-2 file:cursor-pointer hover:file:bg-blue-700"
            />
            {files.lyrics && (
              <p className="text-sm text-green-400 mt-2">✅ {files.lyrics.name}</p>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Cover Art (JPG, PNG, WebP, Optional)
            </label>
            <input
              type="file"
              name="cover"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-2 file:cursor-pointer hover:file:bg-blue-700"
            />
            {files.cover && (
              <p className="text-sm text-green-400 mt-2">✅ {files.cover.name}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {loading ? '📤 Uploading...' : '🚀 Upload Song'}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm">
            💡 <strong>Note:</strong> This page is protected by a secret admin password and key. Only authorized users can access this endpoint.
          </p>
        </div>
      </div>
    </div>
  );
}
