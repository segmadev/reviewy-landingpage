import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Section } from './ui/Section';

const ClosingCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Section className="bg-gradient-to-r from-primary/10 via-transparent to-primary/5 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Most CV tools were designed to look impressive.
            <span className="block text-primary">Reviewme was designed to get you hired.</span>
          </h2>

          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Stop wasting time on generic templates. Start building a CV that UK employers actually want to read.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/builder')}
              className="rounded-lg flex items-center justify-center gap-2"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/auth/login')}
              className="rounded-lg"
            >
              Login to Your CV
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default ClosingCTA;
