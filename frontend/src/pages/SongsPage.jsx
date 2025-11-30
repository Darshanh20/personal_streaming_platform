import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SongCard from '../components/SongCard';
import { usePlayer } from '../context/PlayerContext';

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong } = usePlayer();

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
              <div key={song.id} onClick={() => playSong(song)}>
                <SongCard
                  title={song.title}
                  coverUrl={song.coverUrl}
                  onPlay={() => playSong(song)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}