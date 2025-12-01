export default function RecentSongsTable({ songs }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden cursor-pointer">
      <div className="overflow-x-auto">
        <table className="w-full text-sm cursor-pointer">
          {/* Header */}
          <thead className="bg-neutral-950 border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4 text-left text-gray-400 font-semibold cursor-pointer">Song Title</th>
              <th className="px-6 py-4 text-center text-gray-400 font-semibold cursor-pointer">Plays</th>
              <th className="px-6 py-4 text-center text-gray-400 font-semibold cursor-pointer">Status</th>
              <th className="px-6 py-4 text-right text-gray-400 font-semibold cursor-pointer">Created</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-neutral-800">
            {songs && songs.length > 0 ? (
              songs.map((song) => (
                <tr key={song.id} className="hover:bg-neutral-850 transition-colors cursor-pointer">
                  {/* Title */}
                  <td className="px-6 py-4">
                    <p className="text-white font-medium truncate cursor-pointer">{song.title}</p>
                  </td>

                  {/* Plays */}
                  <td className="px-6 py-4 text-center cursor-pointer">
                    <p className="text-gray-300 cursor-pointer">{song.plays || 0}</p>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 text-center cursor-pointer">
                    {song.published ? (
                      <span className="inline-block px-3 py-1 bg-green-900/30 text-green-400 text-xs font-semibold rounded-full border border-green-800 cursor-pointer">
                        Published
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-yellow-900/30 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-800 cursor-pointer">
                        Draft
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-right text-gray-400 cursor-pointer">
                    {formatDate(song.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 cursor-pointer">
                  No songs yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
