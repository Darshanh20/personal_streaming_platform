import { useState } from 'react';

export default function LyricsDisplay({ lyrics, title }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!lyrics) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(lyrics);
    // Could add a toast notification here
    alert('Lyrics copied to clipboard!');
  };

  return (
    <section className="bg-gray-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Lyrics</h2>
            <p className="text-gray-400">{title}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all duration-300 cursor-pointer hover:shadow-lg text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/50 text-sm font-medium"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {/* Lyrics Container */}
        <div
          className={`bg-gray-900 rounded-2xl border border-gray-800 p-8 transition-all duration-300 ${
            isExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'
          }`}
        >
          <pre className="text-white font-mono text-base md:text-lg leading-relaxed whitespace-pre-wrap wrap-break-word">
            {lyrics}
          </pre>
        </div>

        {/* Expand Hint */}
        {!isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none rounded-2xl" />
        )}
      </div>
    </section>
  );
}
