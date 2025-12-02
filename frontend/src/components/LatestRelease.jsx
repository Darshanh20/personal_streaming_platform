import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LatestRelease() {
  const [latestSong, setLatestSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestSong();
  }, []);

  const fetchLatestSong = async () => {
    try {
      const response = await fetch(`${API_URL}/songs`);
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setLatestSong(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongClick = () => {
    if (latestSong) {
      playSong(latestSong);
      navigate(`/song/${latestSong.id}`);
    }
  };

  return (
    <section className="relative w-full min-h-[65vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-[#0d0d19] via-[#141428] to-[#0a0a18]">
      {/* Decorative Gradient Blobs - White & Gray Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gray-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gray-500/10 rounded-full blur-3xl" />
      </div>

      {loading ? (
        <div className="relative z-10 text-center text-gray-400">
          <p>Loading latest release...</p>
        </div>
      ) : latestSong ? (
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20">
          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT: Album Artwork */}
            <div className="flex justify-center md:justify-start order-2 md:order-1">
              <div
                className="group cursor-pointer"
                onClick={handleSongClick}
              >
                {latestSong.coverUrl ? (
                  <img
                    src={latestSong.coverUrl}
                    alt={latestSong.title}
                    className="w-full max-w-sm aspect-square rounded-2xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full max-w-sm aspect-square bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl">
                    <div className="text-6xl text-gray-600">♫</div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Song Details */}
            <div className="flex flex-col justify-center space-y-8 order-1 md:order-2 md:text-left text-center">
              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                  {latestSong.title}
                </h1>
                <p className="text-sm text-gray-400">Latest Release</p>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                {latestSong.description || 'Experience premium audio quality with our latest track. High-fidelity streaming and exclusive content.'}
              </p>

              {/* Listen Now Button */}
              <div className="pt-4">
                <button
                  onClick={handleSongClick}
                  className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 active:scale-95 text-lg cursor-pointer"
                >
                  Listen Now
                </button>
              </div>

              {/* Quality Badge */}
              <p className="text-xs text-gray-500">
                🎧 High-quality streaming — Premium audio
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 text-center text-gray-400 py-20">
          No songs available yet
        </div>
      )}
    </section>
  );
}
