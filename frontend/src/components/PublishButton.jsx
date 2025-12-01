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
    <div className="flex flex-col gap-1">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`flex-1 px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
          published
            ? 'bg-green-900/30 text-green-400 border border-green-900/40 hover:bg-green-900/40 hover:border-green-900/60'
            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/40 hover:bg-yellow-900/40 hover:border-yellow-900/60'
        } ${loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        {loading ? '...' : published ? 'Unpub' : 'Publish'}
      </button>
      {error && <p className="text-red-500 text-xs text-center mt-0.5 cursor-pointer">{error}</p>}
    </div>
  );
}
