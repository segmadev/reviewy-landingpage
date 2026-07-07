import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Check, Target } from 'lucide-react';

const UKFocused: React.FC = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-mint-50/50 via-mint-100/30 to-primary/5">
      {/* Large top left gradient blob - primary focus */}
      <div className="absolute -top-20 -left-32 -z-10 w-96 h-96 bg-gradient-to-br from-primary/25 to-mint-50/20 rounded-full blur-3xl" />

      {/* Large top right gradient blob - secondary accent */}
      <div className="absolute -top-10 -right-40 -z-10 w-[500px] h-[500px] bg-gradient-to-l from-blue-400/15 via-primary/10 to-transparent rounded-full blur-3xl" />

      {/* Bottom left accent blob */}
      <div className="absolute -bottom-20 left-1/3 -z-10 w-96 h-96 bg-gradient-to-tr from-primary/20 via-mint-200/20 to-transparent rounded-full blur-3xl" />

      {/* Bottom right subtle blob */}
      <div className="absolute bottom-0 right-0 -z-10 w-64 h-64 bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-3xl" />

      {/* Decorative grid pattern - more visible */}
      <div className="absolute inset-0 -z-10 opacity-[0.08]" style={{
        backgroundImage: 'linear-gradient(90deg, #68AE24 1px, transparent 1px), linear-gradient(#68AE24 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-mint-50 border border-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Globe className="w-4 h-4" />
            For UK Job Seekers
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
            Your CV, built for the UK job market.
            <span className="text-primary"> Not any market.</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Most CV tools were built for the US. ReviewYme was built for British job seekers — with the language, conventions, and standards that UK recruiters and ATS systems actually expect.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {[
            {
              icon: Check,
              title: 'No Photo Required',
              description: 'CV photos are uncommon in the UK. We\'ve designed every template without photo placeholders.',
            },
            {
              icon: Globe,
              title: 'British English',
              description: 'British spelling conventions, date formats, and terminology that match UK job descriptions.',
            },
            {
              icon: Target,
              title: 'ATS-Optimized',
              description: 'Formatted to pass UK applicant tracking systems while staying visually compelling.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-mint-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 shadow-sm">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UKFocused;
