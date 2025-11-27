import { Link } from 'react-router-dom';

export default function Navigation({ isAdmin, setIsAdmin }) {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-400">
          🎵 Music Platform
        </Link>
        
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className="hover:text-blue-400 transition">
              Admin Panel
            </Link>
          )}
          
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-4 py-2 rounded transition ${
              isAdmin
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isAdmin ? 'Exit Admin' : 'Admin Login'}
          </button>
        </div>
      </div>
    </nav>
  );
}
