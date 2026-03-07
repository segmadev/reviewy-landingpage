import React from 'react';
import { Upload, Briefcase, Lock } from 'lucide-react';
import { Section } from './ui/Section';
import { Button } from './ui/Button';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Create or Upload Your CV',
      description: 'Start from scratch or upload your existing CV.',
    },
    {
      icon: Briefcase,
      title: 'Tailor Instantly to Any Job',
      description: 'AI tailored your CV for each job opportunity.',
    },
    {
      icon: Lock,
      title: 'Share Only When You Say So',
      description: 'Full consent and control over your data.',
    },
  ];

  return (
    <Section className="bg-gray-50">
      <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Three simple steps to transform your job search</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-mint-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
              
              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent -z-10" 
                     style={{ left: `calc(${((index + 1) * 100) / 3}% - 50%)`, width: '33%' }} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="rounded-xl px-10">
            Try It Out Now
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default HowItWorks;
