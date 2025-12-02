import { formatDistanceToNow } from 'date-fns';

export default function SongHeader({ song }) {
  if (!song) return null;

  return (
    <section className="bg-linear-to-br mt-12 from-gray-900 via-gray-950 to-black py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Cover Art */}
          <div className="flex justify-center md:justify-start md:col-span-1">
            <div className="relative group">
              <img
                src={song.coverUrl || '♫'}
                alt={song.title}
                className="w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-2xl shadow-black/50 group-hover:shadow-blue-900/40 transition-all duration-300"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Song Details */}
          <div className="md:col-span-2 space-y-6 text-white">
            {/* Title */}
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">
                {song.title}
              </h1>
            </div>

            {/* Description */}
            {song.description && (
              <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
                {song.description}
              </p>
            )}

            {/* Tags */}
            {song.tags && song.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {song.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-full hover:bg-gray-700 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
