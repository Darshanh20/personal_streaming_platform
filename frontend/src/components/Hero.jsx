import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeroImageDisplay from './HeroImageDisplay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Hero() {
  const [heroSettings, setHeroSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/hero`);
      const data = await response.json();
      if (data.success && data.data) {
        setHeroSettings(data.data);
      }
    } catch (err) {
      console.error('Error fetching hero settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // If hero is disabled, don't render
  if (loading || !heroSettings || heroSettings.enabled === false) {
    return null;
  }

  // Convert hex to rgba for overlay
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const overlayRgba = hexToRgba(
    heroSettings.overlayColor || '#000000',
    heroSettings.overlayOpacity || 0.65
  );

  const textColor = heroSettings.textColor || 'white';

  return (
    <section className="relative min-h-screen bg-black flex items-center justify-center text-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <HeroImageDisplay />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayRgba,
          zIndex: 1,
        }}
      />

      {/* CONTENT */}
      <div
        className="relative z-20 max-w-3xl mx-auto px-6 animate-fade-up pt-28 pb-20"
        style={{
          textShadow: heroSettings.textShadow ? '0 2px 8px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        {/* Heading */}
        <h1
          className={`text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6 ${
            textColor === 'black' ? 'text-black' : 'text-white'
          }`}
        >
          {heroSettings.heading}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 ${
            textColor === 'black' ? 'text-gray-800' : 'text-gray-300'
          }`}
        >
          {heroSettings.subheading}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={heroSettings.primaryBtnLink || '/songs'}
            className={`px-10 py-3 font-semibold rounded-sm transition-colors duration-300 w-full sm:w-auto text-center ${
              textColor === 'black'
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {heroSettings.primaryBtnText}
          </Link>

          <Link
            to={heroSettings.secondaryBtnLink || '/lyrics'}
            className={`px-10 py-3 font-semibold rounded-sm transition-all duration-300 w-full sm:w-auto text-center ${
              textColor === 'black'
                ? 'border border-black/80 text-black hover:bg-black hover:text-white'
                : 'border border-white/80 text-white hover:bg-white hover:text-black'
            }`}
          >
            {heroSettings.secondaryBtnText}
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
