import { useState } from 'react';

export default function YouTubeEmbed({ videoUrl }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [youtubeId] = useState(() => {
    if (!videoUrl) return null;

    // Extract YouTube video ID from various URL formats
    let id = null;
    
    if (videoUrl.includes('youtube.com/watch?v=')) {
      id = videoUrl.split('v=')[1]?.split('&')[0];
    } else if (videoUrl.includes('youtu.be/')) {
      id = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    } else if (videoUrl.includes('youtube.com/embed/')) {
      id = videoUrl.split('embed/')[1]?.split('?')[0];
    }
    return id;
  });

  if (!videoUrl || !youtubeId) {
    return (
      <section className="bg-gray-950 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
            <p className="text-gray-400">YouTube video not available</p>
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 cursor-pointer"
              >
                Watch on YouTube →
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Music Video</h2>
          {!isLoaded && (
            <p className="text-gray-400 text-sm">Loading video...</p>
          )}
        </div>

        {/* YouTube Embed */}
        <div className="relative w-full pb-[56.25%] bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/50">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title="YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* External Link */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Playing from your linked YouTube video
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/50 transition-all duration-300 cursor-pointer text-sm font-medium"
          >
            Open in YouTube
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
