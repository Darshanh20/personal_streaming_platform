export default function SongCard({ title, artist = 'Artist', coverUrl, onPlay }) {
  return (
    <div className="group cursor-pointer">
      {/* Cover */}
      <div className="aspect-square bg-gray-900 border border-gray-800 flex items-center justify-center hover:border-gray-700 transition-all duration-300 mb-4 relative overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-center group-hover:scale-110 transition-transform duration-300">
            <div className="text-5xl mb-2">♫</div>
            <p className="text-gray-500 text-xs">Album Cover</p>
          </div>
        )}

        {/* Play Button Overlay */}
        <button
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-300"
        >
          <div className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            ▶
          </div>
        </button>
      </div>

      {/* Info */}
      <h3 className="text-white font-bold text-sm truncate">{title}</h3>
      <p className="text-gray-500 text-xs truncate">{artist}</p>
    </div>
  );
}
