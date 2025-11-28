import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LatestRelease() {
  const [latestSong, setLatestSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestSong();
  }, []);

  const fetchLatestSong = async () => {
    try {
      const response = await fetch(`${API_URL}/songs`);
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        // First song is the latest (sorted by createdAt desc in API)
        setLatestSong(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="bg-black py-20 px-6 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-16 text-center">Latest Release</h2>

        {loading ? (
          <div className="text-center text-gray-400">Loading latest release...</div>
        ) : latestSong ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Cover Art */}
            <div className="flex justify-center">
              {latestSong.coverUrl ? (
                <img
                  src={latestSong.coverUrl}
                  alt={latestSong.title}
                  className="w-full aspect-square object-cover border border-gray-800 hover:border-gray-700 transition-colors duration-300"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-900 border border-gray-800 flex items-center justify-center hover:border-gray-700 transition-colors duration-300">
                  <div className="text-center">
                    <div className="text-8xl mb-4">♫</div>
                    <p className="text-gray-500 text-sm">No Cover Art</p>
                  </div>
                </div>
              )}
            </div>

            {/* Release Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-4xl font-bold text-white mb-3">{latestSong.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {latestSong.description || 'Check out this fresh track with high-quality streaming and exclusive lyrics.'}
                </p>
              </div>

              <div className="flex gap-4 text-sm text-gray-500">
                {latestSong.duration && (
                  <span>⏱️ {formatDuration(latestSong.duration)}</span>
                )}
                {latestSong.createdAt && (
                  <span>📅 {new Date(latestSong.createdAt).toLocaleDateString()}</span>
                )}
              </div>

              <div className="pt-4">
                <Link
                  to="/songs"
                  className="inline-block px-8 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors duration-300"
                >
                  Listen Now
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-500">
                  {latestSong.audioUrl ? '🎵 High-quality streaming' : ''}
                  {latestSong.audioUrl && latestSong.lyricsUrl ? ' • ' : ''}
                  {latestSong.lyricsUrl ? '📝 Lyrics included' : ''}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">No songs available yet</div>
        )}
      </div>
    </section>
  );
}
