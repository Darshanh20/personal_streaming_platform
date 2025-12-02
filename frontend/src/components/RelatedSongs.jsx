import { useState, useEffect } from 'react';
import SongCard from '@components/SongCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function RelatedSongs({ currentSongId, currentTags }) {
  const [relatedSongs, setRelatedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTags || currentTags.length === 0) {
      setLoading(false);
      return;
    }

    const fetchRelatedSongs = async () => {
      try {
        const response = await fetch(`${API_URL}/songs`);
        const data = await response.json();

        if (data.success && data.data) {
          // Filter songs by matching tags and exclude current song
          const related = data.data
            .filter((song) => {
              if (song.id === currentSongId) return false;
              if (!song.tags || song.tags.length === 0) return false;
              // Check if song shares at least one tag
              return song.tags.some((tag) => currentTags.includes(tag));
            })
            .slice(0, 3); // Limit to 3 songs

          setRelatedSongs(related);
        }
      } catch (error) {
        console.error('Error fetching related songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedSongs();
  }, [currentSongId, currentTags]);

  if (loading) {
    return (
      <section className="bg-black py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-400">Loading related songs...</div>
        </div>
      </section>
    );
  }

  if (!relatedSongs || relatedSongs.length === 0) {
    return null;
  }

  return (
    <section className="bg-black py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">More From This Style</h2>
          <p className="text-gray-400">Similar songs you might enjoy</p>
        </div>

        {/* Related Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedSongs.map((song) => (
            <div
              key={song.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <SongCard
                id={song.id}
                song={song}
                title={song.title}
                coverUrl={song.coverUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
