import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Radio, Unlock, Users, FileCheck } from 'lucide-react';
import { Button } from './ui/Button';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-mint-50 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-primary leading-tight mb-6">
              Build Your Perfect CV. <br />
              Get Matched Instantly.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              AI-powered CV tailoring and consent-driven recruiter matching — fast, fair, and fully GDPR-compliant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="md">
                Start Building My CV
              </Button>
              <Button variant="outline" size="md">
                I’m a Recruiter – Discover Talent
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
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
            </div>
          </motion.div>

          {/* Right Side - Visual Flow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: FileText, label: 'Create CV', color: 'bg-blue-50 text-blue-600' },
                  { icon: ShieldCheck, label: 'Consent', color: 'bg-purple-50 text-purple-600' },
                  { icon: Radio, label: 'Broadcast', color: 'bg-orange-50 text-orange-600' },
                  { icon: Unlock, label: 'Unlock', color: 'bg-green-50 text-green-600' },
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex flex-col items-center text-center p-4 rounded-2xl border border-gray-50 hover:border-gray-200 hover:shadow-md transition-all bg-white"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${step.color}`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-900">{step.label}</span>
                    <span className="text-xs text-gray-400 mt-1">Step {index + 1}</span>
                  </motion.div>
                ))}
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
      </div>
    </section>
  );
};

export default Hero;
