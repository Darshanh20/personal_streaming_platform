import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const PlayerContext = createContext();

// LocalStorage keys
const STORAGE_KEYS = {
  CURRENT_SONG: 'player_current_song',
  CURRENT_TIME: 'player_current_time',
  IS_PLAYING: 'player_is_playing',
};

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [allSongs, setAllSongs] = useState([]);
  const [songHistory, setSongHistory] = useState([]);
  const audioRef = useRef(null);
  const shouldPlayRef = useRef(false);

  // Load player state from localStorage on mount
  useEffect(() => {
    const savedSong = localStorage.getItem(STORAGE_KEYS.CURRENT_SONG);
    const savedTime = localStorage.getItem(STORAGE_KEYS.CURRENT_TIME);
    const savedIsPlaying = localStorage.getItem(STORAGE_KEYS.IS_PLAYING);

    if (savedSong) {
      try {
        const song = JSON.parse(savedSong);
        // Use initialization function instead of setState in effect
        setCurrentSong(song);
        
        if (savedTime) {
          const time = parseFloat(savedTime);
          setCurrentTime(time);
        }

        // Only auto-play if it was playing before reload
        if (savedIsPlaying === 'true') {
          shouldPlayRef.current = true;
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error loading saved player state:', error);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SONG);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_TIME);
        localStorage.removeItem(STORAGE_KEYS.IS_PLAYING);
      }
    }
  }, []);

  // Save current song to localStorage
  useEffect(() => {
    if (currentSong) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SONG, JSON.stringify(currentSong));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SONG);
    }
  }, [currentSong]);

  // Save current time to localStorage (throttled to every second)
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (currentSong && currentTime > 0) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_TIME, currentTime.toString());
      }
    }, 1000); // Save every second to avoid excessive writes

    return () => clearInterval(saveInterval);
  }, [currentSong, currentTime]);

  // Save playing state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_PLAYING, isPlaying.toString());
  }, [isPlaying]);

  // Play a song
  const playSong = (song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    shouldPlayRef.current = true;
    setIsPlaying(true);

    // Track play count in backend
    if (song && song.id) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      fetch(`${API_URL}/admin/songs/${song.id}/play`, {
        method: 'POST',
      }).catch(error => {
        console.warn('Could not track play count:', error);
      });
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  // Play next - sequential song from all songs
  const playNext = useCallback(() => {
    if (allSongs.length === 0) return;
    
    // Find current song index
    const currentIndex = allSongs.findIndex(song => song.id === currentSong?.id);
    
    // Calculate next index (loop back to 0 at the end)
    const nextIndex = (currentIndex + 1) % allSongs.length;
    const nextSong = allSongs[nextIndex];
    
    // Add current song to history before playing next
    if (currentSong) {
      setSongHistory(prev => [...prev, currentSong]);
    }
    
    playSong(nextSong);
  }, [allSongs, currentSong, playSong]);

  // Play previous - play from history, or first song if no history
  const playPrevious = () => {
    if (songHistory.length === 0) {
      // If no history, restart current song
      setCurrentTime(0);
      shouldPlayRef.current = true;
      setIsPlaying(true);
      return;
    }

    // Get last song from history
    const previousSong = songHistory[songHistory.length - 1];
    const newHistory = songHistory.slice(0, -1);
    
    setSongHistory(newHistory);
    playSong(previousSong);
  };

  // Set current time
  const seekTo = (time) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Handle volume change
  const setPlayerVolume = (vol) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  // Fetch all songs on mount
  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/songs`);
        const data = await response.json();
        if (data.success && data.data) {
          setAllSongs(data.data);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchAllSongs();
  }, []);

  // Effect: handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Effect: update time on audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      // Auto-play when metadata is loaded and shouldPlay flag is set
      if (shouldPlayRef.current && isPlaying) {
        audio.play().catch((err) => {
          console.error('Error auto-playing audio:', err);
          setIsPlaying(false);
        });
        shouldPlayRef.current = false;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Could auto-play next song here
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying]);

  // Effect: set audio source and load
  useEffect(() => {
    if (!audioRef.current || !currentSong?.audioUrl) return;

    audioRef.current.src = currentSong.audioUrl;
    audioRef.current.load();
  }, [currentSong]);

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    audioRef,
    allSongs,
    playSong,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setPlayerVolume,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} crossOrigin="anonymous" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
