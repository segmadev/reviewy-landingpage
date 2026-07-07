import React from 'react';
import { Globe, Link2, CheckCircle2, Sparkles, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { Card } from './ui/Card';

const WhyReviewyMe: React.FC = () => {

  const differentiators = [
    {
      icon: Globe,
      title: 'Built for the UK',
      description: 'British English throughout. No photos, no date of birth. Two-page CV standard. Everything aligned to how UK recruiters actually hire.',
    },
    {
      icon: Link2,
      title: 'Paste a Job URL — Done',
      description: 'No copy-pasting job descriptions. Drop in the link from any UK job board and our AI reads the role requirements for you, instantly.',
    },
    {
      icon: CheckCircle2,
      title: 'Guided, Not Guessed',
      description: 'We walk you through every section step by step — work history, skills, summary — so nothing important gets missed or undersold.',
    },
    {
      icon: Sparkles,
      title: 'Tone That Fits the Role',
      description: 'Whether you\'re applying to a law firm or a tech startup, your CV reads in the register that sector expects — not generic AI copy.',
    },
    {
      icon: Shield,
      title: 'ATS and Human-Ready',
      description: 'Your CV passes automated screening and impresses the recruiter who opens it. Both hurdles, cleared at once.',
    },
    {
      icon: Users,
      title: 'For Every Career Stage',
      description: 'Graduate, career changer, or senior professional — ReviewYme adapts to where you are and where you\'re going.',
    },
  ];

  return (
    <Section className="bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
        <p className="text-lg text-gray-600">Built specifically for the UK job market, by people who understand it</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {differentiators.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default WhyReviewyMe;
