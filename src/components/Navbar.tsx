import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center cursor-pointer">
          <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-8 w-auto" />
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center space-x-8">
          {['CV Snippet', 'Template', 'Pricing'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center space-x-4">
          <Button size="md">
            Get Started
          </Button>
          <Button variant="outline" size="md" className="hidden md:block">
            Login
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
