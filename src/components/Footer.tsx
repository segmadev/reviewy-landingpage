import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-8 w-auto" />
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600">
            {['Privacy Notice', 'Terms of Use', 'GDPR Compliance', 'Contact', 'Resources', 'Support'].map((item) => (
              <a key={item} href="#" className="hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 border-t border-gray-100 pt-8">
          © 2025 ReviewyMe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
