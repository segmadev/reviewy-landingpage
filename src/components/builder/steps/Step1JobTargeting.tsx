import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBuilder } from '../../../context/BuilderContext';

// ── Step 1 ───────────────────────────────────────────────────────────────────
export default function Step1JobTargeting() {
  const { state, dispatch, nextStep } = useBuilder();
  const [value, setValue] = useState(state.jobDescription || '');

  const handleNext = () => {
    dispatch({ type: 'SET_JOB_DESCRIPTION', payload: value });
    nextStep();
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Targeting</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-1">
        This data helps the AI understand the job posting you're currently applying for.
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">
        Insert the link to the job posting you're applying to, or copy in the job description.
        You can also paste your existing CV to auto-fill your details.
      </p>

      {/* Input */}
      <textarea
        rows={6}
        placeholder="Paste the job description for the position you're applying to…"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:outline-none transition-colors text-sm text-gray-800 placeholder:text-gray-300 resize-none leading-relaxed"
      />

      {/* CTA button */}
      <div className="mt-6 pb-6 lg:pb-0">
        <button
          onClick={handleNext}
          className="w-full lg:w-auto px-7 py-3 rounded-xl border-2 border-primary bg-mint-50 text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all"
        >
          Target the Job →
        </button>
      </div>
    </motion.div>
  );
}
