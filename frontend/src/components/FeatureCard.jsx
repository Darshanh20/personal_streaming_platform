export default function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-gray-950 border border-gray-800 p-8 rounded-sm hover:border-gray-700 hover:scale-105 transition-all duration-300 group cursor-pointer">
      {/* Icon */}
      {icon && (
        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
