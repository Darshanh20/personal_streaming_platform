export default function StatusBadge({ published }) {
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
        published
          ? 'bg-green-500 text-white'
          : 'bg-yellow-500 text-black'
      }`}
    >
      {published ? 'Published' : 'Draft'}
    </span>
  );
}
