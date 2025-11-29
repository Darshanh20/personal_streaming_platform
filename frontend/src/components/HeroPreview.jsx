import { Link } from 'react-router-dom';

/**
 * HeroPreview Component
 * Displays a live preview of the hero section exactly as it appears on the home page
 * Uses the same CSS classes and layout as the actual Hero component
 */
export default function HeroPreview({
  imageUrl,
  overlayColor,
  overlayOpacity,
  heading,
  subheading,
  primaryBtnText,
  primaryBtnLink,
  secondaryBtnText,
  secondaryBtnLink,
  textColor,
  textShadow,
  imageFit,
  blur,
  brightness,
  contrast,
  imageOpacity,
  enabled,
}) {
  if (!enabled) {
    return (
      <div className="relative min-h-64 bg-gray-900 flex items-center justify-center text-center">
        <div className="text-gray-400">
          <p className="text-lg font-semibold">Hero Section Disabled</p>
          <p className="text-sm">Enable it to show on the home page</p>
        </div>
      </div>
    );
  }

  // Build CSS filter string for image
  const filters = [
    `blur(${blur || 0}px)`,
    `brightness(${brightness || 1})`,
    `contrast(${contrast || 1})`,
  ].join(' ');

  // Convert hex to rgba for overlay
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const overlayRgba = hexToRgba(overlayColor || '#000000', overlayOpacity || 0.65);

  return (
    <section className="relative min-h-64 bg-black flex items-center justify-center text-center overflow-hidden">
      {/* Background Image */}
      {imageUrl && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${imageUrl}')`,
            backgroundSize: imageFit || 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            opacity: imageOpacity || 1,
            filter: filters,
            zIndex: 0,
          }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayRgba,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        className="relative z-20 max-w-3xl mx-auto px-6 py-16 md:py-20 animate-fade-up pt-16 pb-16"
        style={{
          textShadow: textShadow ? '0 2px 8px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        {/* Heading */}
        <h1
          className={`text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 md:mb-6 ${
            textColor === 'white' ? 'text-white' : 'text-black'
          }`}
        >
          {heading || 'Welcome to My Music.'}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-6 md:mb-10 ${
            textColor === 'white' ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          {subheading || 'Exclusive tracks, lyrics, and stories'}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          {/* Primary Button */}
          <a
            href={primaryBtnLink || '/songs'}
            onClick={(e) => e.preventDefault()}
            className={`px-8 md:px-10 py-2 md:py-3 font-semibold rounded-sm transition-colors duration-300 w-full sm:w-auto text-center ${
              textColor === 'white'
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-black text-white hover:bg-gray-900 border border-black'
            }`}
          >
            {primaryBtnText || 'Listen Now'}
          </a>

          {/* Secondary Button */}
          <a
            href={secondaryBtnLink || '/lyrics'}
            onClick={(e) => e.preventDefault()}
            className={`px-8 md:px-10 py-2 md:py-3 font-semibold rounded-sm transition-all duration-300 w-full sm:w-auto text-center ${
              textColor === 'white'
                ? 'border border-white/80 text-white hover:bg-white hover:text-black'
                : 'border border-black/80 text-black hover:bg-black hover:text-white'
            }`}
          >
            {secondaryBtnText || 'View Lyrics'}
          </a>
        </div>
      </div>

      {/* Animation */}
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
          animation: fadeUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
