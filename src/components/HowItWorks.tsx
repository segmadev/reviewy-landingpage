import React from 'react';
import { Upload, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { Button } from './ui/Button';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const steps = [
    {
      icon: Upload,
      title: 'Paste a Job URL',
      description: 'No copy-pasting job descriptions. Drop in the link from any UK job board and our AI reads the role requirements.',
    },
    {
      icon: Briefcase,
      title: 'Build Step-by-Step',
      description: 'We walk you through every section — work history, skills, summary — so nothing important gets missed.',
    },
  ];

  return (
    <Section className="relative bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-32 top-1/3 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-white to-gray-50/50 rounded-3xl p-8 md:p-16 border border-gray-100 shadow-xl shadow-primary/5 backdrop-blur-sm"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Guided, Not Guessed</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">A simple two-step process that gets your CV job-ready</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto relative mb-12">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/4 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 bg-gradient-to-br from-primary/10 via-primary/5 to-blue-400/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-lg shadow-primary/10 border border-primary/20 group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300 relative"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <step.icon className="w-10 h-10 relative z-10" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Button size="lg" className="rounded-xl px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-shadow" onClick={() => navigate('/builder')}>
              Try It Out Now
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
};

export default HowItWorks;
