import React from 'react';
import { Star } from 'lucide-react';

import { Section } from './ui/Section';
import { Card } from './ui/Card';

const Testimonials: React.FC = () => {

  const testimonials = [
    {
      name: 'David L.',
      role: 'Recruiter',
      text: 'The pay-per-unlock model is fantastic. It saves us so much budget and time by focusing on high-intent candidates.',
    },
    {
      name: 'Aisha K.',
      role: 'Software Engineer',
      text: 'I built and tailored my CV in 10 minutes. The matching system actually works and respects my privacy.',
    },
    {
      name: 'Marcus J.',
      role: 'Hiring Manager',
      text: 'ReviewyMe delivers the most relevant candidates I’ve seen on any platform. A game changer for recruitment.',
    },
  ];

  return (
    <Section className="bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <div className="flex gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
            <div>
              <p className="font-bold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default Testimonials;
