import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Section } from './ui/Section';

const CVInMotion: React.FC = () => {
  return (
    <Section className="bg-gray-50 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left - Visual */}
        <div className="w-full lg:w-1/2 relative flex justify-center">
          {/* Pulse Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 rounded-full border border-primary/30"
                initial={{ width: 0, height: 0, opacity: 1, x: '-50%', y: '-50%' }}
                animate={{ 
                  width: [200, 500], 
                  height: [200, 500], 
                  opacity: [0.5, 0] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 1,
                  ease: "easeOut" 
                }}
              />
            ))}
          </div>

          {/* Resume Visual */}
          <div className="relative bg-white w-full max-w-md h-[500px] rounded-2xl shadow-2xl p-8 border border-gray-100 z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="flex gap-4 mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-mint-50 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Overlay Badge */}
            <div className="absolute bottom-8 right-8 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg animate-bounce">
              Live Broadcast
            </div>
          </div>
        </div>

        {/* Right - Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Your CV, In Motion.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            When you enable Pulse, your anonymised CV snippet is shared instantly with verified recruiters. 
            No more applying into the void — let the opportunities come to you while you maintain complete control.
          </p>
          <ul className="space-y-4">
            {[
              'Instant visibility to top recruiters',
              'Completely anonymised until you approve',
              'Real-time match notifications'
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-gray-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default CVInMotion;
