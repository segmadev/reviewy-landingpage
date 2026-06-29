import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authState, setAuthState] = useState({ isAuthenticated: false, user: null as any });
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const isLanding = location.pathname === '/';

  // Sync auth state from context
  useEffect(() => {
    setAuthState({ isAuthenticated, user });
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div className="hidden md:flex items-center space-x-3">
          {authState.isAuthenticated && authState.user ? (
            <>
              <span className="text-gray-600 font-medium">
                Welcome, {authState.user.fullName?.split(' ')[0] || authState.user.email}
              </span>
              <Button size="md" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
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
                      <p className="text-sm font-medium text-gray-900">
                        Welcome, {authState.user.fullName?.split(' ')[0] || authState.user.email}
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
