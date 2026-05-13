import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useBuilder } from '../../../context/BuilderContext';
import { generateSummary } from '../../../services/api';

export default function Step6Summary() {
  const { state, dispatch, nextStep, prevStep } = useBuilder();
  const [summary, setSummary] = useState(state.professionalSummary);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    const generated = await generateSummary({
      contactDetails: state.contactDetails,
      workExperience: state.workExperience,
      skills: state.skills,
    });
    setSummary(generated);
    setGenerating(false);
  };

  const handleNext = () => {
    dispatch({ type: 'SET_SUMMARY', payload: summary });
    nextStep();
  };

  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      key="step6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Professional Summary</h2>

      <p className="text-gray-600 mt-4 mb-6 text-sm leading-relaxed">
        A strong 3–4 sentence summary at the top of your CV is the first thing recruiters read. Our AI generates one based on your work history, skills, and the target job.
      </p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Your Summary</label>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 bg-mint-50 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
          >
            {generating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full"
                />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                AI Generate
              </>
            )}
          </button>
        </div>
        <textarea
          rows={6}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Click 'AI Generate' to create a tailored summary, or write your own…"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm resize-none"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-400">Aim for 60–100 words</p>
          <p className={`text-xs font-medium ${wordCount > 120 ? 'text-danger' : wordCount >= 60 ? 'text-primary' : 'text-gray-400'}`}>
            {wordCount} words
          </p>
        </div>
      </div>

      {wordCount >= 60 && wordCount <= 120 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-mint-50 border border-primary/20 mb-4"
        >
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <p className="text-xs text-gray-600">Great length! Recruiters spend ~6 seconds on the summary.</p>
        </motion.div>
      )}

      <div className="flex justify-between mt-4 pb-6 lg:pb-0 gap-3">
        <Button variant="outline" size="md" onClick={prevStep} className="hidden lg:inline-flex">← Previous</Button>
        <Button size="lg" onClick={handleNext} className="w-full lg:w-auto">Save & Continue →</Button>
      </div>
    </motion.div>
  );
}
