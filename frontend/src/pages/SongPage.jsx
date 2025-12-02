import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '@components/Navbar';
import SongHeader from '@components/SongHeader';
import LyricsDisplay from '@components/LyricsDisplay';
import YouTubeEmbed from '@components/YouTubeEmbed';
import SocialButtons from '@components/SocialButtons';
import RelatedSongs from '@components/RelatedSongs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SongPage() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSong();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchSong = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/songs/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load song');
      }

      setSong(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="animate-spin text-white text-4xl mb-4">♫</div>
          <p className="text-gray-400 text-lg">Loading song...</p>
        </div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-red-400 text-xl font-semibold mb-4">
              ❌ {error || 'Song not found'}
            </p>
            <a
              href="/songs"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
            >
              Back to Songs
            </a>
          </div>
        </div>
      </div>
    );
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: song.title,
    description: song.description,
    image: song.coverUrl,
    url: pageUrl,
    uploadDate: song.createdAt,
    author: {
      '@type': 'Person',
      name: song.uploadedBy?.username || 'Unknown Artist',
    },
    ...(song.audioUrl && { audio: { '@type': 'AudioObject', url: song.audioUrl } }),
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{song.title} - Darshan Music Platform</title>
        <meta name="description" content={song.description || `Listen to ${song.title}`} />
        <meta name="keywords" content={song.tags?.join(', ') || 'music, song'} />

        {/* Open Graph Tags */}
        <meta property="og:type" content="music.song" />
        <meta property="og:title" content={song.title} />
        <meta property="og:description" content={song.description || `Listen to ${song.title}`} />
        <meta property="og:image" content={song.coverUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Darshan Music Platform" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={song.title} />
        <meta name="twitter:description" content={song.description || `Listen to ${song.title}`} />
        <meta name="twitter:image" content={song.coverUrl} />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

        {/* Music Meta Tags */}
        <meta property="music:musician" content={song.uploadedBy?.username || 'Unknown Artist'} />
        <meta property="music:song" content={pageUrl} />
      </Helmet>

      <div className="min-h-screen bg-black">
        <Navbar />

        {/* Song Header */}
        <SongHeader song={song} />

        {/* Lyrics Section */}
        {song.lyrics && <LyricsDisplay lyrics={song.lyrics} title={song.title} />}

        {/* YouTube Embed */}
        {song.songUrl?.includes('youtube') && <YouTubeEmbed videoUrl={song.songUrl} />}

        {/* Social Buttons */}
        <SocialButtons song={song} pageUrl={pageUrl} />

        {/* Related Songs */}
        {song.tags && song.tags.length > 0 && (
          <RelatedSongs currentSongId={song.id} currentTags={song.tags} />
        )}
      </div>
    </>
  );
}
