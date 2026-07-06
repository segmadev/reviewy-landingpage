import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';

const WhatYouGet: React.FC = () => {

  const benefits = [
    'A CV tailored to each specific role you apply for — not a template you fill in',
    'Achievement-led bullet points with measurable results, not vague responsibilities',
    'Keywords woven in naturally so ATS systems rank you higher without sounding stuffed',
    'A 3-line professional summary that positions you clearly for the role — no buzzwords, no fluff',
    'A final polish pass so your CV reads as a confident, credible UK candidate from line one',
  ];

  return (
    <Section className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What You Get</h2>
          <p className="text-lg text-gray-600 mb-8">Everything you need to stand out to UK employers</p>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 items-start p-4 rounded-lg bg-white border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <div className="shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-gray-700 text-base leading-relaxed">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default WhatYouGet;
