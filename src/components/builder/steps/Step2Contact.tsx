import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/Button';
import { useBuilder } from '../../../context/BuilderContext';
import { useAuth } from '../../../context/AuthContext';
import { getUserProfile } from '../../../services/api';
import type { ContactDetails } from '../../../types/resume';

export default function Step2Contact() {
  const { state, dispatch, nextStep, prevStep } = useBuilder();
  const { user } = useAuth();
  const [contact, setContact] = useState<ContactDetails>({ ...state.contactDetails });
  const [linkedin, setLinkedin] = useState(state.linkedinProfile);
  const [portfolio, setPortfolio] = useState<string[]>([...state.portfolioLinks]);

  // Auto-fill contact details from user profile
  useEffect(() => {
    if (!user?.id || contact.fullName) return;

    getUserProfile()
      .then((profile) => {
        setContact((prev) => ({
          ...prev,
          fullName: profile.fullName || prev.fullName,
          email: profile.email || prev.email,
        }));
      })
      .catch((error) => {
        console.error('Failed to fetch profile:', error);
      });
  }, [user?.id]);

  const handleNext = () => {
    dispatch({ type: 'SET_CONTACT', payload: contact });
    dispatch({ type: 'SET_LINKEDIN', payload: linkedin });
    dispatch({ type: 'SET_PORTFOLIO', payload: portfolio });
    nextStep();
  };

  const field = (
    label: string,
    key: keyof ContactDetails,
    placeholder: string,
    type = 'text'
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={contact[key]}
        onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
        className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
      />
    </div>
  );

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Contact Details</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-2">Your personal info that appears at the top of your CV.</p>

      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              placeholder="Alexander"
              value={contact.fullName.split(' ')[0] ?? ''}
              onChange={(e) => {
                const parts = contact.fullName.split(' ');
                parts[0] = e.target.value;
                setContact({ ...contact, fullName: parts.join(' ').trim() });
              }}
              className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Wright"
              value={contact.fullName.split(' ').slice(1).join(' ')}
              onChange={(e) => {
                const first = contact.fullName.split(' ')[0] ?? '';
                setContact({ ...contact, fullName: `${first} ${e.target.value}`.trim() });
              }}
              className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('Email', 'email', 'you@example.com', 'email')}
          {field('Phone', 'phone', '07700 900123', 'tel')}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
            <input
              type="text"
              placeholder="E14 5AB"
              value={contact.address.split(',').pop()?.trim() ?? ''}
              onChange={(e) => {
                const parts = contact.address.split(',');
                if (parts.length > 1) {
                  parts[parts.length - 1] = ` ${e.target.value}`;
                  setContact({ ...contact, address: parts.join(',') });
                } else {
                  setContact({ ...contact, address: e.target.value });
                }
              }}
              className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
              defaultValue="GB"
            >
              <option value="GB">United Kingdom</option>
              <option value="IE">Ireland</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="NL">Netherlands</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Online Profiles</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/yourname"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub / Portfolio</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={portfolio[0] ?? ''}
                  onChange={(e) => setPortfolio([e.target.value, portfolio[1] ?? ''])}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
                <input
                  type="url"
                  placeholder="https://yoursite.io"
                  value={portfolio[1] ?? ''}
                  onChange={(e) => setPortfolio([portfolio[0] ?? '', e.target.value])}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pb-6 lg:pb-0 gap-3">
        <Button variant="outline" size="md" onClick={prevStep} className="hidden lg:inline-flex">
          ← Previous
        </Button>
        <Button size="lg" onClick={handleNext} className="w-full lg:w-auto">
          Save & Continue →
        </Button>
      </div>
    </motion.div>
  );
}
