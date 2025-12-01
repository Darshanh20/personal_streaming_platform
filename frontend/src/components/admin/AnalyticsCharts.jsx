import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsCharts({ topSongs }) {
  return (
    <div className="space-y-8">
      {/* Top 5 Songs - Bar Chart */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 cursor-pointer">
        <h3 className="text-xl font-semibold text-white mb-6 cursor-pointer">Top 5 Most Played Songs</h3>
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
          <div className="h-80 flex items-center justify-center text-gray-500 cursor-pointer">
            No songs yet
          </div>
        )}
      </div>

    </div>
  );
}
