import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsCharts({ playTrends, topSongs, publishStats }) {
  const pieColors = ['#10b981', '#fbbf24'];

  return (
    <div className="space-y-8">
      {/* Play Trends - Line Chart */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Play Trends (Last 30 Days)</h3>
        {playTrends && playTrends.length > 0 && playTrends.some(t => t.playCount > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={playTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                interval={4}
              />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="playCount"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            Not enough data to show trends yet
          </div>
        )}
      </div>

      {/* Top 5 Songs - Bar Chart */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Top 5 Most Played Songs</h3>
        {topSongs && topSongs.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSongs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="title"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="plays" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No songs yet
          </div>
        )}
      </div>

      {/* Published vs Draft - Pie Chart */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Published vs Draft</h3>
        {publishStats ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Published', value: publishStats.published },
                  { name: 'Draft', value: publishStats.drafts },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#fbbf24" />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
