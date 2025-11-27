import { useState, useEffect } from 'react';

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/songs`);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-2">🔄 Loading songs...</p>
          <div className="animate-spin text-blue-500 text-3xl">⏳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg">
            ❌ {error}
          </div>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">🎵 No songs found</p>
          <p className="text-gray-500 text-sm">Upload your first song from the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">🎵 Music Library</h1>
          <p className="text-gray-400">
            {songs.length} {songs.length === 1 ? 'song' : 'songs'} available
          </p>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition cursor-pointer group"
              onClick={() => setSelectedSong(song)}
            >
              {/* Cover Image */}
              {song.coverUrl ? (
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full h-48 object-cover group-hover:opacity-75 transition"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-500 transition">
                  <span className="text-5xl">🎵</span>
                </div>
              )}

              {/* Song Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{song.title}</h3>

                {song.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {song.description}
                  </p>
                )}

                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 text-sm">⏱️ {formatDuration(song.duration)}</span>
                </div>

                {/* Tags */}
                {song.tags && song.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {song.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {song.tags.length > 3 && (
                      <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                        +{song.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Play Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition">
                  ▶️ Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Now Playing Modal */}
      {selectedSong && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-white">{selectedSong.title}</h2>
              <button
                onClick={() => setSelectedSong(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Cover Image */}
            {selectedSong.coverUrl && (
              <img
                src={selectedSong.coverUrl}
                alt={selectedSong.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            {/* Song Details */}
            <div className="space-y-4 mb-6">
              {selectedSong.description && (
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{selectedSong.description}</p>
                </div>
              )}

              <div className="flex gap-8">
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="text-white text-lg">
                    {formatDuration(selectedSong.duration)}
                  </p>
                </div>
              </div>

              {selectedSong.tags && selectedSong.tags.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSong.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Player */}
            {selectedSong.audioUrl && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Player</p>
                <audio
                  controls
                  src={selectedSong.audioUrl}
                  className="w-full bg-gray-700 rounded"
                />
              </div>
            )}

            {/* Download Links */}
            <div className="flex gap-3">
              {selectedSong.audioUrl && (
                <a
                  href={selectedSong.audioUrl}
                  download
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold text-center transition"
                >
                  📥 Download Audio
                </a>
              )}

              {selectedSong.lyricsUrl && (
                <a
                  href={selectedSong.lyricsUrl}
                  download
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold text-center transition"
                >
                  📝 Download Lyrics
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
