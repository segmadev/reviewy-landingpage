import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';

const Comparison: React.FC = () => {

  const comparisons = [
    {
      feature: 'US-first, often American English by default',
      reviewme: 'UK-native from the ground up',
      reviewmeOnly: true,
    },
    {
      feature: 'Upload and hope — no guided process',
      reviewme: 'Step-by-step guided CV build',
      reviewmeOnly: true,
    },
    {
      feature: 'Keyword matching only, misses tone',
      reviewme: 'Tone, voice, and keywords — all aligned',
      reviewmeOnly: true,
    },
    {
      feature: 'One-size CV for all roles and industries',
      reviewme: 'Tailored to your exact role and sector',
      reviewmeOnly: true,
    },
    {
      feature: 'No UK recruiter or ATS awareness',
      reviewme: 'Built to pass both ATS and human review',
      reviewmeOnly: true,
    },
  ];

  return (
    <Section className="bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">ReviewYme vs The Rest</h2>
        <p className="text-lg text-gray-600">Why ReviewYme is built differently</p>
      </motion.div>

      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Other tools</th>
                <th className="text-left py-4 px-6 font-semibold text-primary">ReviewYme</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-3">
                      <X className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{row.feature}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{row.reviewme}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="md:hidden space-y-4">
          {comparisons.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Other Tools Section */}
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Other tools</div>
                <div className="flex items-start gap-2">
                  <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{row.feature}</span>
                </div>
              </div>

              {/* ReviewYme Section */}
              <div className="bg-white p-3">
                <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">ReviewYme</div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{row.reviewme}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Comparison;
