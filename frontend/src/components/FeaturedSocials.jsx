export default function FeaturedSocials() {
  const socials = [
    {
      id: 'instagram',
      icon: '📸',
      title: 'Instagram',
      subtitle: 'Follow me on Instagram',
      description: 'Catch my latest rap verses in exclusive reels, behind-the-scenes studio sessions, and fresh music updates. Stay connected for daily creative content and special announcements.',
      buttonText: 'Visit Profile',
      url: 'https://instagram.com/darshan.hotchandani',
      accentColor: 'from-pink-600 to-purple-600',
    },
    {
      id: 'youtube',
      icon: '▶️',
      title: 'YouTube',
      subtitle: 'Watch my videos',
      description: 'New song videos drop every month with stunning visuals and high-quality audio. Subscribe now to never miss a release and join the growing community.',
      buttonText: 'Visit Channel',
      url: 'https://youtube.com/@darshanhotchandani',
      accentColor: 'from-red-600 to-red-700',
    },
  ];

  const handleVisit = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-black py-20 px-6 border-t border-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Featured Socials</h2>
          <p className="text-gray-400 text-lg">Connect with me on social media</p>
        </div>

        {/* Socials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {socials.map((social) => (
            <div
              key={social.id}
              className="group bg-linear-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:scale-105"
            >
              {/* Icon */}
              <div
                className={`w-20 h-20 mx-auto mb-6 bg-linear-to-br ${social.accentColor} rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                {social.icon}
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{social.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{social.subtitle}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{social.description}</p>
              </div>

              {/* Button */}
              <button
                onClick={() => handleVisit(social.url)}
                className="w-full py-3 px-6 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:shadow-lg active:scale-95"
              >
                {social.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
