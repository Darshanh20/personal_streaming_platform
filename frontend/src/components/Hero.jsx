import { Link } from 'react-router-dom';
import HeroImageDisplay from './HeroImageDisplay';

export default function Hero() {
  return (
    <section className="min-h-screen bg-black pt-20 flex items-center relative overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
      `}</style>

      {/* Hero Background Image */}
      <HeroImageDisplay />

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full relative z-20">
        {/* Left Content */}
        <div className="space-y-8 animate-fade-up">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              Welcome to My Music.
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              Exclusive tracks, lyrics, and stories. Experience a curated collection of original music.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/songs"
              className="px-8 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors duration-300 text-center"
            >
              Listen Now
            </Link>
            <button className="px-8 py-3 border border-white text-white font-medium hover:bg-white hover:text-black transition-all duration-300">
              View Lyrics
            </button>
          </div>
        </div>

        {/* Right Image Placeholder (hidden if hero image exists) */}
        <div className="hidden md:flex justify-center animate-fade-up animation-delay-200">
          <div className="w-full aspect-square bg-gradient-to-br from-gray-900 to-black border border-gray-800 flex items-center justify-center hover:border-gray-700 transition-colors duration-300">
            <div className="text-center">
              <div className="text-6xl mb-4">♫</div>
              <p className="text-gray-500 text-sm">Album Artwork</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
