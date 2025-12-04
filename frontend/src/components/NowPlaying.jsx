import { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function NowPlaying() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const pollIntervalRef = useRef(null);

  // Fetch currently playing track
  const fetchNowPlaying = async () => {
    try {
      const response = await fetch(`${API_URL}/spotify/now-playing`);
      const json = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
        }
        setError(null);
        setData(null);
        return;
      }

      if (json.success && json.data) {
        setData(json.data);
        setAuthenticated(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching now playing:', err);
      setError('Failed to fetch track');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on mount and fetch immediately
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const response = await fetch(`${API_URL}/spotify/status`);
        const json = await response.json();
        if (json.success && json.authenticated) {
          setAuthenticated(true);
          // Immediately fetch now playing if authenticated
          fetchNowPlaying();
        } else {
          setAuthenticated(false);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Could not check Spotify auth status:', err);
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, []);

  // Set up polling only when authenticated
  useEffect(() => {
    if (authenticated) {
      pollIntervalRef.current = setInterval(fetchNowPlaying, 10000); // Poll every 10 seconds
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [authenticated]);

  const handleLoginClick = () => {
    const loginUrl = `${API_URL.replace('/api', '')}/api/spotify/login`;
    window.open(loginUrl, '_blank');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchNowPlaying();
  };

  if (!authenticated) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-green-950 to-gray-950 rounded-xl shadow-lg border border-green-900/50">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl">🎵</div>
          <h3 className="text-lg font-bold text-white text-center">Now Playing on Spotify</h3>
          <p className="text-sm text-gray-400 text-center">Connect your Spotify account to see what you're listening to</p>
          <button
            onClick={handleLoginClick}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>🎧</span>
            Login with Spotify
          </button>
          <p className="text-xs text-gray-500 text-center">
            After connecting, you'll be redirected back to this page
          </p>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-green-950 to-gray-950 rounded-xl shadow-lg border border-green-900/50 flex items-center justify-center gap-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-green-950 to-gray-950 rounded-xl shadow-lg border border-green-900/50">
        <p className="text-red-400 text-sm text-center">{error}</p>
      </div>
    );
  }

  // Not playing
  if (!data || !data.playing) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-green-950 to-gray-950 rounded-xl shadow-lg border border-green-900/50">
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-400 text-sm">Not playing anything right now</p>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors duration-200"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    );
  }

  // Now playing
  const progressPercent = data.duration_ms > 0 ? (data.progress_ms / data.duration_ms) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gradient-to-br from-green-950 to-gray-950 rounded-xl shadow-lg border border-green-900/50 overflow-hidden">
      {/* Album Art */}
      {data.albumArt && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={data.albumArt}
            alt={data.song}
            className="w-full aspect-square object-cover"
          />
        </div>
      )}

      {/* Playing Badge */}
      {data.is_playing && (
        <div className="flex items-center gap-2 mb-3 px-3 py-1 bg-green-900/50 rounded-full w-fit">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-300">Playing now</span>
        </div>
      )}

      {/* Track Info */}
      <div className="mb-4">
        <a
          href={data.track_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-lg font-bold text-white mb-1 hover:text-green-400 transition-colors ${
            !data.track_url && 'cursor-default'
          }`}
        >
          {data.song}
        </a>
        <p className="text-sm text-gray-400">{data.artists}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(data.progress_ms)}</span>
          <span>{formatTime(data.duration_ms)}</span>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex gap-2">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded transition-colors duration-200"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
        <a
          href={data.track_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded transition-colors duration-200 text-center ${
            !data.track_url && 'opacity-50 cursor-default'
          }`}
        >
          Open
        </a>
      </div>

      {/* Spotify Logo / Attribution */}
      <p className="text-xs text-gray-600 text-center mt-3">Powered by Spotify</p>
    </div>
  );
}

function formatTime(ms) {
  if (!ms || ms < 0) return '0:00';
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
