import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-4">🎵 Music Platform</h1>
          <p className="text-xl text-gray-100 mb-8">
            Discover, play, and share amazing music from around the world
          </p>
          <Link
            to="/songs"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Browse Music Library →
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition">
            <div className="text-5xl mb-4">🎧</div>
            <h3 className="text-2xl font-bold text-white mb-2">Stream Music</h3>
            <p className="text-gray-400">
              Listen to high-quality audio tracks with built-in player
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">View Lyrics</h3>
            <p className="text-gray-400">
              Download and read lyrics for every song in our library
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">Beautiful UI</h3>
            <p className="text-gray-400">
              Modern interface designed for the best listening experience
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Start Exploring</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Dive into our music library and discover your next favorite track
          </p>
          <Link
            to="/songs"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            Browse All Songs
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4 text-center text-gray-500">
        <p>© 2024 Music Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

