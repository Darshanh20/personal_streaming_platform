import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminSongList({ songs, onEdit, onDelete, refreshTrigger }) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (songId) => {
    if (!window.confirm('Are you sure you want to delete this song?')) {
      return;
    }

    setDeleting(songId);
    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (!adminKey) {
        throw new Error('Admin key not configured');
      }

      const response = await fetch(`${API_URL}/admin/songs/${songId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete song');
      }

      // Call parent callback
      onDelete(songId);
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('❌ Failed to delete song');
    } finally {
      setDeleting(null);
    }
  };

  if (!songs || songs.length === 0) {
    return (
      <div className="bg-gray-950 border border-gray-800 p-12 text-center">
        <p className="text-gray-400 text-lg">No songs uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {songs.map((song) => (
        <div
          key={song.id}
          className="bg-gray-950 border border-gray-800 p-6 hover:border-gray-700 transition-colors duration-300"
        >
          <div className="flex gap-6">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gray-900 border border-gray-800 flex items-center justify-center">
                {song.coverUrl ? (
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-2xl">♫</span>
                )}
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg truncate">{song.title}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {song.description || 'No description'}
              </p>
              <div className="flex gap-4 text-xs text-gray-500 mt-3">
                {song.duration && <span>⏱️ {song.duration}s</span>}
                {song.createdAt && (
                  <span>📅 {new Date(song.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 items-center flex-shrink-0">
              <button
                onClick={() => onEdit(song)}
                className="px-4 py-2 text-white border border-gray-600 hover:border-gray-400 hover:bg-gray-900 transition-all duration-300 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(song.id)}
                disabled={deleting === song.id}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  deleting === song.id
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-red-500 hover:text-red-400'
                }`}
              >
                {deleting === song.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
