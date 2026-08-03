import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-mint-50 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-primary leading-tight mb-6">
              Build Your Perfect CV.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              AI-powered CV tailoring system — fast, fair, and fully GDPR-compliant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                size="lg"
                onClick={() => navigate('/builder')}
                className="px-8 py-4 text-base font-semibold"
              >
                Start Building My CV
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/auth/login')}
                className="px-8 py-4 text-base font-semibold"
              >
                Already have a CV? Login
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              ✓ No photos required  ✓ British English  ✓ ATS-optimized
            </p>
          </motion.div>

          {/* Right Side - Visual Flow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="p-8 rounded-3xl relative z-10">
              <div className="w-full">
                <img src="/asstes/hero-img.png" alt="" className="w-full h-auto" />
              </div>

              {/* Connecting Lines (Visual only) */}
              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-20" viewBox="0 0 400 400">
                <path d="M100 100 L300 100 L300 300 L100 300 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" className="text-gray-400" />
              </svg>
            </div>

            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          </motion.div>
        </div>

        {/* Background blobs */}
        <div className="absolute top-20 right-0 -z-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Hero;
