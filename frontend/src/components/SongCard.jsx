import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

export default function SongCard({ id, song, title, coverUrl, onPlay }) {
  const navigate = useNavigate();
  const { playSong } = usePlayer();

  const handleClick = () => {
    if (song) {
      playSong(song);
    } else if (onPlay) {
      onPlay();
    }
    if (id) {
      navigate(`/song/${id}`);
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    handleClick();
  };

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      {/* Album Image - Rounded, Full Width */}
      <div className="relative overflow-hidden rounded-xl mb-3 aspect-square bg-gray-900">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="text-center">
              <div className="text-5xl text-gray-600">♫</div>
            </div>
          </div>
        )}

        {/* Subtle Shadow Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          {/* Play Icon */}
          <svg
            className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
            onClick={handlePlayClick}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Text Content - Clean & Minimal */}
      <div className="space-y-1">
        <h3 className="text-white font-semibold text-base truncate group-hover:text-gray-100 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm truncate">
          Listen now
        </p>
      </div>
    </div>
  );
}
