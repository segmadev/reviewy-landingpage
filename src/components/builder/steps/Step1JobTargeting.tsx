import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBuilder } from '../../../context/BuilderContext';

// ── Step 1 ───────────────────────────────────────────────────────────────────
export default function Step1JobTargeting() {
  const { state, dispatch, nextStep } = useBuilder();
  const [value, setValue] = useState(state.jobDescription || '');

  // Sync local state when global state changes (e.g., from auto-fill when editing)
  useEffect(() => {
    setValue(state.jobDescription || '');
  }, [state.jobDescription]);

  const handleNext = () => {
    if (!value || value.trim().length === 0) return;
    dispatch({ type: 'SET_JOB_DESCRIPTION', payload: value });
    nextStep();
  };

  const isValid = value && value.trim().length > 0;
  const charCount = value.trim().length;

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

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-400">Job description is required</p>
        <p className={`text-xs font-medium ${charCount > 0 ? 'text-primary' : 'text-gray-400'}`}>
          {charCount} characters
        </p>
      </div>

      {/* CTA button */}
      <div className="mt-6 pb-6 lg:pb-0">
        <button
          onClick={handleNext}
          disabled={!isValid}
          title={!isValid ? 'Please enter a job description to continue' : ''}
          className={`w-full lg:w-auto px-7 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
            isValid
              ? 'border-primary bg-mint-50 text-primary hover:bg-primary hover:text-white cursor-pointer'
              : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Target the Job →
        </button>
      </div>
    </motion.div>
  );
}
