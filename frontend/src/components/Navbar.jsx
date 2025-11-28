import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [activeNav, setActiveNav] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'music', label: 'Music', href: '/songs' },
    { id: 'lyrics', label: 'Lyrics', href: '#lyrics' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-95 backdrop-blur-sm z-50 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:text-gray-300 transition-colors duration-300">
          DhxMusic
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveNav(item.id)}
              className={`text-sm font-medium transition-all duration-300 relative group ${
                activeNav === item.id ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                  activeNav === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </a>
          ))}
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden text-white text-xl hover:text-gray-300 transition-colors duration-300">
          ☰
        </button>
      </div>
    </nav>
  );
}
