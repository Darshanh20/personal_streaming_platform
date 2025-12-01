export default function DashboardCard({ icon, label, value, subtitle }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm hover:border-neutral-700 transition-all duration-300 cursor-pointer">
      <div className="flex items-center justify-between gap-4">
        {/* Icon */}
        <div className="text-4xl cursor-pointer">{icon}</div>

        {/* Content */}
        <div className="flex-1 text-right cursor-pointer">
          <p className="text-gray-400 text-sm mb-1 cursor-pointer">{label}</p>
          <p className="text-white text-3xl font-bold cursor-pointer">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1 cursor-pointer">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
