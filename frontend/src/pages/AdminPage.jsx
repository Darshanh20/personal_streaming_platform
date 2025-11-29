import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import AdminSongList from '../components/AdminSongList';
import AdminEditSongForm from '../components/AdminEditSongForm';
import AdminSongUploadForm from '../components/AdminSongUploadForm';
import AdminHeroSettingsForm from '../components/AdminHeroSettingsForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
  // Authentication state
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  // Dashboard state
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [heroModalOpen, setHeroModalOpen] = useState(false);

  // Fetch songs from backend
  useEffect(() => {
    if (authenticated) {
      fetchSongs();
    }
  }, [refreshTrigger, authenticated]);

  const fetchSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (!adminKey) {
        throw new Error('Admin key not configured');
      }

      const response = await fetch(`${API_URL}/admin/songs`, {
        headers: {
          'x-admin-key': adminKey,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }

      const data = await response.json();
      setSongs(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

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
    setError(null);
    setSongs([]);
  };

  const handleEdit = (song) => {
    setEditingSong(song);
  };

  const handleSaveEdit = (updatedSong) => {
    // Update the song in the list
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === updatedSong.id ? updatedSong : song
      )
    );
    setEditingSong(null);
  };

  const handleDelete = (songId) => {
    // Remove the song from the list
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
  };

  const handleUploadSuccess = async () => {
    // Refresh the songs list
    setRefreshTrigger((prev) => prev + 1);
  };

  // Password Screen (Authentication Gate)
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Lock Icon */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Enter password to access admin dashboard</p>
          </div>

          {/* Password Form */}
          <form onSubmit={handlePasswordSubmit} className="bg-gray-950 border border-gray-800 p-8 space-y-6">
            {/* Error Message */}
            {passwordError && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-sm">
                {passwordError}
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Admin Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter your admin password"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition-colors duration-300"
                autoFocus
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 font-bold text-black bg-white hover:bg-gray-100 transition-colors duration-300"
            >
              Unlock Admin Panel
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-gray-950 border border-gray-800 rounded-sm p-6">
            <p className="text-gray-400 text-sm">
              🔒 <strong>This is a restricted area.</strong> Only authorized administrators can access this dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard (After Authentication)
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Admin Navbar - Logo + Logout */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-white tracking-tight">
            DhxMusic
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-300"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-20 px-6 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your music collection</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-sm mb-8">
              ❌ {error}
            </div>
          )}

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 pb-16 border-b border-gray-800">
            {/* Add Song Card */}
            <div
              onClick={() => setUploadModalOpen(true)}
              className="group cursor-pointer bg-gray-950 border border-gray-800 hover:border-gray-700 transition-all duration-300 p-8 rounded-lg hover:shadow-lg hover:shadow-blue-900/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Add New Song</h3>
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🎵</div>
              </div>
              <p className="text-gray-400 text-sm">Upload and add a new song to your collection</p>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <button
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadModalOpen(true);
                  }}
                >
                  Open Editor
                </button>
              </div>
            </div>

            {/* Hero Image Editor Card */}
            <div
              onClick={() => setHeroModalOpen(true)}
              className="group cursor-pointer bg-gray-950 border border-gray-800 hover:border-gray-700 transition-all duration-300 p-8 rounded-lg hover:shadow-lg hover:shadow-purple-900/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Hero Settings</h3>
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🎨</div>
              </div>
              <p className="text-gray-400 text-sm">Customize the hero banner on your homepage</p>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <button
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeroModalOpen(true);
                  }}
                >
                  Open Editor
                </button>
              </div>
            </div>
          </div>

          {/* Songs List Section */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">📚 All Songs</h2>
              <p className="text-gray-400 text-sm">
                {songs.length > 0 ? `${songs.length} song${songs.length !== 1 ? 's' : ''} in your collection` : 'No songs yet'}
              </p>
            </div>

            {loading ? (
              <div className="bg-gray-950 border border-gray-800 p-12 text-center">
                <p className="text-gray-400">Loading songs...</p>
              </div>
            ) : (
              <AdminSongList
                songs={songs}
                onEdit={handleEdit}
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
              />
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-950 border border-gray-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-950 border-b border-gray-800 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">🎵 Add New Song</h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <AdminSongUploadForm onSuccess={() => {
                setUploadModalOpen(false);
                handleUploadSuccess();
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Hero Settings Modal */}
      {heroModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-950 border border-gray-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-950 border-b border-gray-800 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">🎨 Hero Settings</h2>
              <button
                onClick={() => setHeroModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <AdminHeroSettingsForm onSuccess={() => {
                setHeroModalOpen(false);
                handleUploadSuccess();
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSong && (
        <AdminEditSongForm
          song={editingSong}
          onSave={handleSaveEdit}
          onCancel={() => setEditingSong(null)}
        />
      )}
    </div>
  );
}
