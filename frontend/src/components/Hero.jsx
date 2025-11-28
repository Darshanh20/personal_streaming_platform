import { Link } from 'react-router-dom';
import HeroImageDisplay from './HeroImageDisplay';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black flex items-center justify-center text-center overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <HeroImageDisplay />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

      {/* CONTENT */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 animate-fade-up pt-28 pb-20">

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
          Welcome to My Music.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
          Exclusive tracks, lyrics, and stories — experience a world of original music, crafted with emotion and depth.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/songs"
            className="px-10 py-3 bg-white text-black font-semibold rounded-sm 
            hover:bg-gray-100 transition-colors duration-300 shadow-sm w-full sm:w-auto"
          >
            Listen Now
          </Link>

          <Link
            to="/lyrics"
            className="px-10 py-3 border border-white/80 text-white font-semibold rounded-sm
            hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto"
          >
            View Lyrics
          </Link>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
