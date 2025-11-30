import { usePlayer } from '../context/PlayerContext';
import { useRef } from 'react';

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setPlayerVolume,
  } = usePlayer();

  const progressBarRef = useRef(null);

  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    seekTo(newTime);
  };

  if (!currentSong) {
    return null;
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 z-40">
      {/* Progress Bar - Clickable */}
      <div
        ref={progressBarRef}
        onClick={handleProgressBarClick}
        className="w-full h-1 bg-gray-900 cursor-pointer group"
      >
        <div
          className="h-full bg-white group-hover:bg-green-500 transition-colors"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Player */}
      <div className="flex items-center justify-between gap-4 p-4 md:p-4">
        {/* Left: Album Cover + Song Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Album Cover */}
          <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gray-800 rounded-md overflow-hidden">
            {currentSong.coverUrl ? (
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                ♫
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm md:text-base truncate">
              {currentSong.title}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm truncate">
              {currentSong.description || 'Unknown Artist'}
            </p>
          </div>
        </div>

        {/* Center: Playback Controls (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={playPrevious}
            className="text-white hover:text-green-500 transition-colors"
            title="Previous"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={togglePlayPause}
            className="text-white hover:text-green-500 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={playNext}
            className="text-white hover:text-green-500 transition-colors"
            title="Next"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2v12zM2 18h2l8-6-8-6v12z" />
            </svg>
          </button>
        </div>

        {/* Mobile Play Button */}
        <button
          onClick={togglePlayPause}
          className="md:hidden text-white hover:text-green-500 transition-colors shrink-0"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Right: Timeline + Volume (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          {/* Time Display */}
          <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setPlayerVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-800 rounded-full cursor-pointer appearance-none"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                  volume * 100
                }%, #374151 ${volume * 100}%, #374151 100%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Hidden Progress Scrubber */}
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seekTo(parseFloat(e.target.value))}
        className="hidden"
      />
    </div>
  );
}
