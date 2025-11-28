import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HorizontalGallery() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch(`${API_URL}/songs`);
      const data = await response.json();

      if (data.success && data.data) {
        setSongs(data.data);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black py-20 px-6 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">More Releases</h2>

        {loading ? (
          <div className="text-center text-gray-400">Loading releases...</div>
        ) : songs.length > 0 ? (
          <>
            <div className="overflow-x-auto scroll-smooth">
              <div className="flex gap-6 pb-4">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="shrink-0 w-48 h-48 bg-gray-900 border border-gray-800 flex items-center justify-center hover:border-gray-700 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  >
                    {song.coverUrl ? (
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl mb-2">♫</div>
                        <p className="text-gray-500 text-xs">{song.title}</p>
                      </div>
                    )}

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ▶
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">← Scroll to explore {songs.length} release{songs.length !== 1 ? 's' : ''} →</p>
          </>
        ) : (
          <div className="text-center text-gray-400">No releases available yet</div>
        )}
      </div>
    </section>
  );
}
