import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Zap, 
  MapPin, 
  Home, 
  Menu, 
  X,
  Activity,
  Leaf
} from 'lucide-react';
import BoltBadge from './BoltBadge';

const NavigationHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navigationItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      description: 'Energy Dashboard'
    },
    {
      name: 'Campus Map',
      path: '/campus-map',
      icon: MapPin,
      description: 'Interactive Map'
    }
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white shadow-sm border-b border-gray-200'
      }`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105 flex-shrink-0"
            aria-label="Smart Energy Manager - Home"
          >
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse">
                <span className="sr-only">System online</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                Smart Energy Manager
              </h1>
              <p className="text-xs text-gray-600 -mt-1">The university campus</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`h-4 w-4 transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                  }`} />
                  <span className="font-medium">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side content */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Status Indicators - Hidden on mobile to make room for badge */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                <Activity className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">Live Data</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
                <Leaf className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Carbon Neutral</span>
              </div>
            </div>

            {/* Bolt Badge - Always visible with responsive sizing */}
            <div className="bolt-badge-container flex-shrink-0">
              <BoltBadge />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 pb-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="pt-4 space-y-2 border-t border-gray-200">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
            
            {/* Mobile Status Indicators */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center justify-between px-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Live Data Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">Carbon Neutral</span>
                </div>
              </div>
              
              {/* Mobile Bolt Badge - Centered */}
              <div className="flex justify-center px-4">
                <BoltBadge />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavigationHeader;