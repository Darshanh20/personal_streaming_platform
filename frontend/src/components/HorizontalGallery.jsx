import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HorizontalGallery() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();
  const navigate = useNavigate();

  const handleSongClick = (song) => {
    playSong(song);
    navigate(`/song/${song.id}`);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch(`${API_URL}/songs`);
      const data = await response.json();

      if (data.success && data.data) {
        // Sort by plays (descending) and show top 3
        const topSongs = data.data
          .sort((a, b) => (b.plays || 0) - (a.plays || 0))
          .slice(0, 3);
        setSongs(topSongs);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black w-full pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 mt-10">More Releases</h2>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading releases...</div>
        ) : songs.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-fit">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="group cursor-pointer"
                  onClick={() => handleSongClick(song)}
                >
                {/* Album Image - Rounded, Full Width */}
                <div className="relative overflow-hidden rounded-xl mb-3 aspect-square bg-gray-900">
                  {song.coverUrl ? (
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                      <div className="text-center">
                        <div className="text-5xl text-gray-600">♫</div>
                      </div>
                    </div>
                  )}

                  {/* Subtle Shadow Overlay with Play Icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    {/* Play Icon */}
                    <svg
                      className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Text Content - Clean & Minimal */}
                <div className="space-y-1">
                  <h3 className="text-white font-semibold text-base truncate group-hover:text-gray-100 transition-colors duration-300">
                    {song.title}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    Listen now
                  </p>
                </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20">No more releases available yet</div>
        )}
      </div>
    </section>
  );
}
