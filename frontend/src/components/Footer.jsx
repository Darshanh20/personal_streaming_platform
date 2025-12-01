export default function Footer() {
  const socialLinks = [
    { name: 'Instagram', icon: '📱' },
    { name: 'YouTube', icon: '▶️' },
    { name: 'Spotify', icon: '♫' },
    { name: 'GitHub', icon: '⚙️' },
  ];

  return (
    <footer className="bg-black border-t border-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left */}
        <div className="text-gray-400 text-sm cursor-pointer">
          DhxMusic © 2025. All rights reserved.
        </div>

        {/* Right - Social Links */}
        <div className="flex gap-8">
          {socialLinks.map((social) => (
            <button
              key={social.name}
              className="text-gray-500 hover:text-gray-300 transition-all duration-300 text-2xl hover:scale-110 cursor-pointer"
              title={social.name}
              aria-label={social.name}
            >
              {social.icon}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
