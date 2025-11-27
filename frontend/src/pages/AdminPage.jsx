import { useState } from 'react';
import SongUploadForm from '../components/SongUploadForm';
import SongsList from '../components/SongsList';

export default function AdminPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Refresh the songs list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">🔐 Admin Panel</h1>
          <p className="text-lg text-gray-100">Upload and manage your music collection</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Upload Form */}
        <div className="mb-16">
          <SongUploadForm onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Songs List */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">📊 All Songs</h2>
          <div key={refreshKey}>
            <SongsList />
          </div>
        </div>
      </div>
    </div>
  );
}
