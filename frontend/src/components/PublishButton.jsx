import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PublishButton({ songId, published, onToggle }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    setError(null);
    setLoading(true);

    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (!adminKey) {
        throw new Error('Admin key not configured');
      }

      const response = await fetch(
        `${API_URL}/admin/toggle-publish?songId=${songId}`,
        {
          method: 'PUT',
          headers: {
            'x-admin-key': adminKey,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to toggle publish status');
      }

      const result = await response.json();
      onToggle?.(result.data);
    } catch (err) {
      setError(err.message || 'Failed to toggle publish status');
      console.error('Publish toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-3 py-1 rounded text-white font-semibold text-sm transition-all duration-300 ${
          published
            ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800'
            : 'bg-green-600 hover:bg-green-700 disabled:bg-green-800'
        } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {loading ? '...' : published ? 'Unpublish' : 'Publish'}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
