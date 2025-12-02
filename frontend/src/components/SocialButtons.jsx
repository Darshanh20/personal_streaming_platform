export default function SocialButtons({ song, pageUrl }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: song.title,
        text: `Check out "${song.title}" on Darshan Music Platform`,
        url: pageUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(pageUrl);
      alert('Link copied to clipboard!');
    }
  };

  const isYouTubeUrl = song.songUrl?.includes('youtube.com') || song.songUrl?.includes('youtu.be');
  const isInstagramUrl = song.songUrl?.includes('instagram.com');
  const instagramUrl = isInstagramUrl ? song.songUrl : 'https://www.instagram.com/darshan.hotchandani/'; // Fallback to main Instagram

  return (
    <section className="bg-gray-950 py-12 px-6 border-y border-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Share This Song</h2>

        <div className="flex flex-wrap gap-4">
          {/* Instagram Button */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-full hover:shadow-lg hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300 cursor-pointer font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.011 4.85.07 3.252.148 4.771 1.691 4.919 4.919.059 1.266.07 1.646.07 4.85s-.011 3.585-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.059-1.645.07-4.85.07-3.204 0-3.584-.011-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.059-1.265-.07-1.645-.07-4.849s.011-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.015-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
              <circle cx="12" cy="12" r="3.6" />
            </svg>
            Follow on Instagram
          </a>

          {/* Generic Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-3 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.589 12.938 10 12.226 10 11.5c0-2.21-1.119-4-2.5-4s-2.5 1.79-2.5 4 1.119 4 2.5 4c.591 0 1.154-.147 1.659-.407m0 0A6.002 6.002 0 0 1 14.414 16H15a2 2 0 1 0 0-4h-.414c.35-.834.75-1.692 1.172-2.5M9 5a3.5 3.5 0 1 1 7 0" />
            </svg>
            Share Song
          </button>

          {/* Copy Link Button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(pageUrl);
              alert('Link copied to clipboard!');
            }}
            className="flex items-center gap-3 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </button>
        </div>
      </div>
    </section>
  );
}
