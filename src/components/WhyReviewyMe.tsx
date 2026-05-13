import React from 'react';
import { Brain, Shield, Zap, FileCheck } from 'lucide-react';

import { Section } from './ui/Section';
import { Card } from './ui/Card';

const WhyReviewyMe: React.FC = () => {
  const reasons = [
    {
      icon: Brain,
      title: 'AI + Human Precision',
      description: 'The perfect balance of algorithmic matching and human insight.',
      className: '',
    },
    // {
    //   icon: Shield,
    //   title: 'Consent at Every Step',
    //   description: 'You control who sees your data and when.',
    //   className: '',
    // },
    // {
    //   icon: Zap,
    //   title: 'Instant Opportunities',
    //   description: 'Get matched in real-time.',
    //   className: '',
    // },
    // {
    //   icon: FileCheck,
    //   title: 'GDPR-First Platform',
    //   description: 'Built with privacy by design.',
    //   className: '',
    // },
  ];

  return (
    <Section className="bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why ReviewyMe</h2>
        <p className="text-lg text-gray-600">The platform that puts you first</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reasons.map((reason, index) => (
          <Card 
            key={index} 
            className="bg-transparent border-primary/20 shadow-none hover:shadow-none hover:-translate-y-0"
          >
            <div className="w-12 h-12 bg-mint-50 rounded-xl flex items-center justify-center text-primary mb-6">
              <reason.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
            <p className="text-gray-600">{reason.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default WhyReviewyMe;
