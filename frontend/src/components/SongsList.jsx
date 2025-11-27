import { useState, useEffect } from 'react';

export default function SongsList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/songs');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch songs');
      }

      setSongs(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">🔄 Loading songs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        ❌ {error}
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No songs found yet 🎵</p>
        <p className="text-gray-500">Upload your first song from the admin panel!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {songs.map(song => (
        <div key={song.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
          {/* Cover Image */}
          {song.coverUrl ? (
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-4xl">🎵</span>
            </div>
          )}

          {/* Song Info */}
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{song.title}</h3>
            
            {song.description && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{song.description}</p>
            )}

            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500 text-sm">⏱️ {formatDuration(song.duration)}</span>
              <span className="text-gray-500 text-xs">By {song.uploadedBy?.username || 'Admin'}</span>
            </div>

            {/* Tags */}
            {song.tags && song.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {song.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {song.audioUrl && (
                <a
                  href={song.audioUrl}
                  download
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center text-sm font-semibold transition"
                >
                  ▶️ Play/Download
                </a>
              )}
              
              {song.lyricsUrl && (
                <a
                  href={song.lyricsUrl}
                  download
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm font-semibold transition"
                  title="Download Lyrics"
                >
                  📝
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
