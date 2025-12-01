import { useEffect, useState } from 'react';
import StatusBadge from './StatusBadge';
import PublishButton from './PublishButton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminSongList({ songs: initialSongs, onEdit, onDelete, refreshTrigger }) {
  const [songs, setSongs] = useState(initialSongs || []);
  const [deleting, setDeleting] = useState(null);

  // Update songs when initial songs change
  useEffect(() => {
    setSongs(initialSongs || []);
  }, [initialSongs, refreshTrigger]);

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

      // Update local songs list
      setSongs((prev) => prev.filter((song) => song.id !== songId));
      // Call parent callback
      onDelete(songId);
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('❌ Failed to delete song');
    } finally {
      setDeleting(null);
    }
  };

  const handlePublishToggle = (updatedSong) => {
    // Update the song in the local list
    setSongs((prev) =>
      prev.map((song) =>
        song.id === updatedSong.id ? updatedSong : song
      )
    );
  };

  if (!songs || songs.length === 0) {
    return (
      <div className="bg-gray-950/50 border border-gray-800/50 p-8 md:p-12 text-center rounded-xl cursor-pointer">
        <p className="text-gray-400 text-base md:text-lg cursor-pointer">No songs uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {songs.map((song) => (
        <div
          key={song.id}
          className="group bg-linear-to-br from-gray-900 to-gray-950 border border-gray-800/60 rounded-2xl overflow-hidden hover:border-gray-700/80 hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
        >
          {/* Album Cover */}
          <div className="relative h-40 md:h-48 bg-gray-800 overflow-hidden">
            {song.coverUrl ? (
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-700 to-gray-800">
                <span className="text-5xl text-gray-600 cursor-pointer">♫</span>
              </div>
            )}
            {/* Status Badge Overlay */}
            <div className="absolute top-3 right-3">
              <StatusBadge published={song.published} />
            </div>
          </div>

          {/* Card Content */}
          <div className="p-5 md:p-6 flex flex-col">
            {/* Song Title */}
            <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300 cursor-pointer">
              {song.title}
            </h3>

            {/* Song Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-1 cursor-pointer">
              {song.description || 'No description provided'}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 md:gap-2.5 items-center justify-between pt-4 border-t border-gray-800/50">
              {/* Publish Button */}
              <PublishButton
                songId={song.id}
                published={song.published}
                onToggle={handlePublishToggle}
              />

              {/* Edit Button */}
              <button
                onClick={() => onEdit(song)}
                className="flex-1 px-3 md:px-4 py-2 text-white text-xs md:text-sm font-medium bg-gray-800/60 hover:bg-gray-700 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Edit
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(song.id)}
                disabled={deleting === song.id}
                className={`flex-1 px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                  deleting === song.id
                    ? 'bg-red-900/40 text-red-400 cursor-not-allowed border border-red-900/30'
                    : 'bg-red-900/20 text-red-400 border border-red-900/40 hover:bg-red-900/30 hover:border-red-900/60 cursor-pointer'
                }`}
              >
                {deleting === song.id ? '...' : '✕'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
