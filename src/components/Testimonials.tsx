import React from 'react';
import { Star } from 'lucide-react';

import { Section } from './ui/Section';
import { Card } from './ui/Card';

const Testimonials: React.FC = () => {

  const testimonials = [
    {
      name: 'Steven',
      role: 'Customer Service Adviser',
      text: 'My ‘achievements’ box had been blank for weeks. The suggestions reminded me of things I’d actually done at work. I kept the ones that were true and deleted the rest.',
    },
    {
      name: 'Jacob',
      role: 'Career changer',
      text: 'I was changing from retail to office admin and didn’t know how to explain my experience. It picked out the stock records and customer queries and worded them the way an admin job would.',
    },
    {
      name: 'David',
      role: 'Software Engineer',
      text: 'I like that nothing goes on the CV until you approve it. Two suggestions didn’t fit my role, so I edited them.',
    },
    {
      name: 'Aisha',
      role: 'Data Analyst',
      text: 'It used the language from the job advert without stuffing in keywords. I still had to adjust a few tools, but the structure saved me a lot of time.',
    },
    {
      name: 'Mary',
      role: 'Public sector worker',
      text: 'I’ve worked in the same organisation for years and had stopped noticing what I do. Seeing it written down properly was a bit of a surprise.',
    },
    {
      name: 'Daniel',
      role: 'Recent graduate',
      text: 'It was clear which bits were suggestions and which were mine. That made me comfortable using it.',
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
