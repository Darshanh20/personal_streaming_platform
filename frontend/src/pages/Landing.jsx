import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import LatestRelease from '../components/LatestRelease';
import HorizontalGallery from '../components/HorizontalGallery';
import Footer from '../components/Footer';

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

      {/* Features Section */}
      <section className="bg-black py-20 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Featured Experience</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <LatestRelease />
      <HorizontalGallery />

      {/* About Section */}
      <section className="bg-gray-950 py-20 px-6 border-t border-gray-900">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">About</h2>

          <p className="text-lg text-gray-300 leading-relaxed">
            I create rap, hip-hop, and experimental tracks. This platform is where I share my original music and lyrics.
            Every release is carefully crafted with attention to production quality and lyrical depth.
          </p>

          <div className="pt-6">
            <a
              href="#"
              className="text-white font-medium text-sm hover:text-gray-300 transition-colors duration-300 inline-flex items-center gap-2 group"
            >
              Read More
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
