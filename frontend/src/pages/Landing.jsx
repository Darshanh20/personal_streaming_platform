import Navbar from '@components/Navbar';
import Hero from '@components/Hero';
import LatestRelease from '@components/LatestRelease';
import HorizontalGallery from '@components/HorizontalGallery';
import FeaturedSocials from '@components/FeaturedSocials';
import ReviewForm from '@components/ReviewForm';
import ReviewsCarousel from '@components/ReviewsCarousel';

export default function Landing() {
  const features = [
    {
      title: 'Stream Music',
      description: 'High-quality playback of all my tracks in crystal clear audio.',
      icon: '♫',
    },
    {
      title: 'Lyrics Library',
      description: 'Cleanly formatted lyrics for every song with full arrangements.',
      icon: '📝',
    },
    {
      title: 'Artwork',
      description: 'Monochrome visuals and premium album covers.',
      icon: '🎨',
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
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

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #000;
        }

        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <Navbar />
      <Hero />

      <LatestRelease />
      <HorizontalGallery />
      <FeaturedSocials />

      {/* Reviews Carousel Section */}
      <ReviewsCarousel />

      {/* Review Form Section */}
      <section className="bg-black py-16 px-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <ReviewForm />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-950 py-20 px-6 border-t border-gray-900">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">About</h2>

          <p className="text-lg text-gray-300 leading-relaxed">
            I’m Darshan, and music has always been my way of expressing the things I can’t always say out loud.
            Over time, what started as ideas typed in my notes slowly turned into songs — each one carrying a story, a mood, or a memory.
            This website is a place where I share all of that openly.
            No labels, no filters, no middlemen — just my voice, my thoughts, and my creativity, directly to you.
            Whether you came to explore, listen, or just vibe for a bit, I’m glad you’re here.
            My journey is just getting started, and having you along for the ride makes it even better.          
            </p>
        </div>
      </section>
    </div>
  );
}
