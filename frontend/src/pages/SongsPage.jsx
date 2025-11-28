import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SongCard from '../components/SongCard';
import Footer from '../components/Footer';

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-2">🔄 Loading songs...</p>
          <div className="animate-spin text-white text-3xl">⏳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-8">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-20">
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-sm">
            ❌ {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-lg">🎵 No songs found</p>
            <p className="text-gray-500 text-sm">Upload your first song from the admin panel</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-20 px-6 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-2">Music Library</h1>
            <p className="text-gray-400">
              {songs.length} {songs.length === 1 ? 'song' : 'songs'} available
            </p>
          </div>

          {/* Songs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {songs.map((song) => (
              <div key={song.id} onClick={() => setSelectedSong(song)}>
                <SongCard
                  title={song.title}
                  coverUrl={song.coverUrl}
                  onPlay={() => setSelectedSong(song)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Song Player Modal */}
      {selectedSong && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 max-w-2xl w-full p-8 space-y-6">
            {/* Close Button */}
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold text-white">{selectedSong.title}</h2>
              <button
                onClick={() => setSelectedSong(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Cover Image */}
            {selectedSong.coverUrl ? (
              <img
                src={selectedSong.coverUrl}
                alt={selectedSong.title}
                className="w-full h-64 object-cover border border-gray-800"
              />
            ) : (
              <div className="w-full h-64 bg-linear-to-br from-gray-900 to-black border border-gray-800 flex items-center justify-center">
                <div className="text-6xl">♫</div>
              </div>
            )}

            {/* Song Details */}
            <div className="space-y-4">
              {selectedSong.description && (
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{selectedSong.description}</p>
                </div>
              )}

              <div className="flex gap-8">
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="text-white text-lg">{formatDuration(selectedSong.duration)}</p>
                </div>
              </div>

              {selectedSong.tags && selectedSong.tags.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSong.tags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-800 text-gray-300 px-3 py-1 text-sm border border-gray-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Player */}
            {selectedSong.audioUrl && (
              <div>
                <p className="text-gray-400 text-sm mb-2">Player</p>
                <audio controls src={selectedSong.audioUrl} className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
