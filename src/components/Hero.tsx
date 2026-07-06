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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">For UK Job Seekers</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
              Your CV, built for the UK job market.
              <span className="text-primary"> Not any market.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
              Most CV tools were built for the US. Reviewme was built for British job seekers — with the language, conventions, and standards that UK recruiters and ATS systems actually expect.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" onClick={() => navigate('/builder')} className="rounded-lg">
                Start Building My CV
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/auth/login')} className="rounded-lg">
                Already have a CV? Login
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              ✓ No photos required  ✓ British English  ✓ ATS-optimized
            </p>

            {/* <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-mint-50 flex items-center justify-center text-primary">
                  <FileCheck className="w-4 h-4" />
                </div>
                <span><strong className="text-gray-900">5,432</strong> CVs tailored this week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-mint-50 flex items-center justify-center text-primary">
                  <Users className="w-4 h-4" />
                </div>
                <span><strong className="text-gray-900">128</strong> users online</span>
              </div>
            </div> */}
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="p-8 rounded-3xl relative z-10">
              <img src="/asstes/hero-img.png" alt="CV Building Process" className="w-full h-auto rounded-2xl" />
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
