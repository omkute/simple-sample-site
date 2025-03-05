
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`sticky top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-white shadow-sm' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-sebba-blue">SEBBA</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-1">
            <Link to="/" className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}>
              Home
            </Link>
            <Link to="/market" className={`nav-link ${isActive('/market') ? 'nav-link-active' : ''}`}>
              Market
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'nav-link-active' : ''}`}>
              About
            </Link>
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'nav-link-active' : ''}`}>
              Profile
            </Link>
          </div>

          <div className="flex items-center">
            <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100 transition duration-200">
              <User size={20} className="text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
