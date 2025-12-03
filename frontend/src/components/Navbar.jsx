import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'music', label: 'Music', href: '/songs' },
  ];

  // Determine active nav based on current route
  const getActiveNav = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/songs') return 'music';
    return 'home';
  };

  const activeNav = getActiveNav();

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gray-900">
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
              onClick={() => handleNavClick()}
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white text-xl hover:text-gray-300 transition-colors duration-300 cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/98 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick()}
                className={`block py-2 text-sm font-medium transition-all duration-300 ${
                  activeNav === item.id
                    ? 'text-white border-l-2 border-white pl-4'
                    : 'text-gray-400 hover:text-white pl-4'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
