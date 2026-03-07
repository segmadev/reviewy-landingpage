import React from 'react';
import { Sparkles, Radio, FileKey } from 'lucide-react';
import { Section } from './ui/Section';
import { Card } from './ui/Card';

const KeyFeatures: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered CV Tailoring',
      description: 'Automatically optimize your CV for every job application with our advanced AI engine.',
    },
    {
      icon: Radio,
      title: 'Consent-Driven Broadcasts',
      description: 'Your profile remains private until you decide to broadcast it to verified recruiters.',
    },
    {
      icon: FileKey,
      title: 'Pay-Per-Unlock Marketplace',
      description: 'Recruiters pay to unlock your full profile, ensuring serious interest only.',
    },
  ];

  return (
    <Section className="bg-white">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
        <p className="text-lg text-gray-600">
          ReviewyMe offers a unique approach to recruitment, putting power back in your hands.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="bg-transparent border-primary/20 shadow-none hover:shadow-none hover:-translate-y-0"
          >
            <div className="w-12 h-12 bg-mint-50 rounded-xl flex items-center justify-center text-primary mb-6">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default KeyFeatures;
