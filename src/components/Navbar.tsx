import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authState, setAuthState] = useState({ isAuthenticated: false, user: null as any });
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const isLanding = location.pathname === '/';
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Sync auth state from context
  useEffect(() => {
    setAuthState({ isAuthenticated, user });
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!profileDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  // Helper function to get display name (up to 10 chars)
  const getDisplayName = (user: any): string => {
    const firstName = user.firstName || user.fullName?.split(' ')[0] || '';
    const lastName = user.lastName || user.fullName?.split(' ')[1] || '';

    if (firstName.length >= 10) {
      return firstName.substring(0, 10) + '...';
    }

    if (firstName && lastName) {
      const combined = `${firstName} ${lastName}`;
      if (combined.length <= 10) {
        return combined;
      }
      const truncated = `${firstName} ${lastName.substring(0, 10 - firstName.length - 1)}`;
      return truncated + '...';
    }

    return firstName || 'User';
  };

  const navLinks = [
    { label: 'How It Works', href: isLanding ? '#how-it-works' : '/#how-it-works' },
    { label: 'Why Us', href: isLanding ? '#why-us' : '/#why-us' },
    { label: 'Testimonials', href: isLanding ? '#testimonials' : '/#testimonials' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isLanding
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-8 w-auto" />
        </Link>

        {/* Center Links — desktop */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) =>
            item.href.startsWith('/') && !item.href.includes('#') ? (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </a>
            )
          )}
        </div>

        {/* Right Buttons — desktop */}
        <div className="hidden md:flex items-center gap-4">
          {authState.isAuthenticated && authState.user ? (
            <>
              {/* User Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: '#68AE24' }}
                  >
                    {(authState.user.firstName?.[0] || authState.user.fullName?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <p className="text-sm font-semibold text-gray-900">
                      {getDisplayName(authState.user)}
                    </p>
                    <p className="text-xs text-gray-500">Account</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-300 z-50 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="px-6 py-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {getDisplayName(authState.user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {authState.user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1 space-y-1">
                        <button
                          onClick={() => {
                            navigate('/dashboard');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md mx-1"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            navigate('/dashboard/account');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md mx-1"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate('/dashboard/account');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md mx-1"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200">
                        <button
                          onClick={async () => {
                            await logout();
                            setProfileDropdownOpen(false);
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="md" onClick={() => navigate('/auth/login')}>
                Login
              </Button>
              <Button size="md" onClick={() => navigate('/builder')}>
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Hamburger — mobile */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((item) =>
                item.href.startsWith('/') && !item.href.includes('#') ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block text-gray-700 font-medium py-2 hover:text-primary transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-gray-700 font-medium py-2 hover:text-primary transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              )}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                {authState.isAuthenticated && authState.user ? (
                  <>
                    <div className="px-2 py-2">
                      <p className="text-xs text-gray-500">Logged in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {authState.user.firstName || authState.user.fullName?.split(' ')[0] || authState.user.email}
                      </p>
                    </div>
                    <Button size="md" className="w-full" onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}>
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={async () => {
                        await logout();
                        navigate('/');
                        setMobileOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="md" className="w-full" onClick={() => { navigate('/auth/login'); setMobileOpen(false); }}>
                      Login
                    </Button>
                    <Button size="md" className="w-full" onClick={() => { navigate('/builder'); setMobileOpen(false); }}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
