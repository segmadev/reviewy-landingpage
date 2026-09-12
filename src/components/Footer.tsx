import React from 'react';
import { Link } from 'react-router-dom';
import { LEGAL_LINKS } from '../config/legal';

interface FooterProps {
  variant?: 'marketing' | 'compact';
}

const Footer: React.FC<FooterProps> = ({ variant = 'marketing' }) => {
  if (variant === 'compact') {
    return (
      <footer className="border-t border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} ReviewyMe</p>
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-xs font-medium text-gray-500 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-8 w-auto" />
          </div>

          {/* Links */}
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="text-center text-sm text-gray-400 border-t border-gray-100 pt-8">
          © {new Date().getFullYear()} ReviewyMe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
