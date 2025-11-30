import { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import AnalyticsCharts from './AnalyticsCharts';
import RecentSongsTable from './RecentSongsTable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (!adminKey) {
        throw new Error('Admin key not configured');
      }

      const response = await fetch(`${API_URL}/admin/analytics`, {
        headers: {
          'x-admin-key': adminKey,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      setAnalytics(data.data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Cards */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 animate-pulse h-24"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-gray-400">No analytics data available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          icon="📊"
          label="Total Songs"
          value={analytics.totalSongs}
        />
        <DashboardCard
          icon="✅"
          label="Published"
          value={analytics.totalPublishedSongs}
          subtitle={`${Math.round((analytics.totalPublishedSongs / analytics.totalSongs * 100) || 0)}%`}
        />
        <DashboardCard
          icon="▶️"
          label="Total Plays"
          value={analytics.totalPlays}
        />
        <DashboardCard
          icon="⭐"
          label="Most Played"
          value={analytics.mostPlayedSong?.plays || 0}
          subtitle={analytics.mostPlayedSong?.title}
        />
      </div>

      {/* Charts Section */}
      <AnalyticsCharts
        playTrends={analytics.playTrends}
        topSongs={analytics.topSongs}
        publishStats={analytics.publishStats}
      />

      {/* Recent Songs Table */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Recent Songs</h2>
        <RecentSongsTable songs={analytics.songs.slice(0, 10)} />
      </div>
    </div>
  );
}
