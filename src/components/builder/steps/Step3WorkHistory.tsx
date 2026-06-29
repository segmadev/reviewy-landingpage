import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Sparkles, Check, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useBuilder } from '../../../context/BuilderContext';
import { getAIBulletPoints } from '../../../services/api';
import { useCVSuggestions } from '../../../hooks/useCVSuggestions';
import type { WorkExperience } from '../../../types/resume';

function newEntry(): WorkExperience {
  return { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', responsibilities: [''] };
}

export default function Step3WorkHistory() {
  const { state, dispatch, nextStep, prevStep } = useBuilder();
  const { suggestions } = useCVSuggestions();
  const [entries, setEntries] = useState<WorkExperience[]>(
    state.workExperience.length > 0 ? state.workExperience : [newEntry()]
  );
  const [aiTarget, setAiTarget] = useState<string | null>(null);
  const [aiBullets, setAiBullets] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const update = (id: string, patch: Partial<WorkExperience>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const updateBullet = (id: string, idx: number, val: string) =>
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, responsibilities: e.responsibilities.map((r, i) => (i === idx ? val : r)) }
          : e
      )
    );

  const addBullet = (id: string) =>
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, responsibilities: [...e.responsibilities, ''] } : e))
    );

  const removeBullet = (id: string, idx: number) =>
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, responsibilities: e.responsibilities.filter((_, i) => i !== idx) } : e
      )
    );

  const requestAI = async (id: string) => {
    setAiTarget(id);
    setAiLoading(true);
    try {
      const response = await getAIBulletPoints(state.jobDescription, []);
      setAiBullets(response.items);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const acceptBullet = (id: string, bullet: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, responsibilities: [...e.responsibilities.filter(Boolean), bullet] } : e
      )
    );
    setAiBullets((prev) => prev.filter((b) => b !== bullet));
  };

  const handleNext = () => {
    dispatch({ type: 'SET_WORK_EXPERIENCE', payload: entries });
    nextStep();
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Work History</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">Add your most recent positions first.</p>

      <div className="space-y-6">
        {entries.map((entry, entryIdx) => (
          <div key={entry.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Position {entryIdx + 1}
              </span>
              {entries.length > 1 && (
                <button
                  onClick={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))}
                  className="text-gray-400 hover:text-danger transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="Senior Software Engineer"
                  value={entry.position}
                  onChange={(e) => update(entry.id, { position: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Employer & Location</label>
                <input
                  type="text"
                  placeholder="Global Fintech Hub (London)"
                  value={entry.company}
                  onChange={(e) => update(entry.id, { company: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                <input
                  type="month"
                  value={entry.startDate.slice(0, 7)}
                  onChange={(e) => update(entry.id, { startDate: e.target.value + '-01' })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                <input
                  type="month"
                  value={entry.endDate.slice(0, 7)}
                  onChange={(e) => update(entry.id, { endDate: e.target.value + '-01' })}
                  placeholder="Leave blank if current"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-2">Key Achievements / Responsibilities</label>
              <div className="space-y-2">
                {entry.responsibilities.map((r, ri) => (
                  <div key={ri} className="flex gap-2 items-start">
                    <span className="text-primary mt-2.5 text-xs shrink-0">▪</span>
                    <input
                      type="text"
                      value={r}
                      onChange={(e) => updateBullet(entry.id, ri, e.target.value)}
                      placeholder="Describe a key achievement or responsibility…"
                      className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-sm"
                    />
                    {entry.responsibilities.length > 1 && (
                      <button
                        onClick={() => removeBullet(entry.id, ri)}
                        className="text-gray-300 hover:text-danger mt-2 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => addBullet(entry.id)}
                className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add bullet point
              </button>
            </div>

            {/* AI Tailoring Button */}
            <button
              onClick={() => requestAI(entry.id)}
              className="flex items-center gap-2 text-xs font-medium text-primary border border-primary/30 bg-mint-50 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Tailoring — suggest bullets
            </button>

            {/* AI Popup */}
            <AnimatePresence>
              {aiTarget === entry.id && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-3 bg-white border border-primary/20 rounded-xl p-4 shadow-md"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-gray-900">AI Suggested Bullets</span>
                    <button
                      onClick={() => { setAiTarget(null); setAiBullets([]); }}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {aiLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                      />
                      AI is generating tailored bullets…
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {aiBullets.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-mint-50 transition-colors">
                          <p className="flex-1 text-xs text-gray-700">{bullet}</p>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => acceptBullet(entry.id, bullet)}
                              className="p-1 rounded-md bg-primary text-white hover:bg-primary-hover"
                              title="Accept"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setAiBullets((prev) => prev.filter((b) => b !== bullet))}
                              className="p-1 rounded-md bg-gray-200 text-gray-500 hover:bg-gray-300"
                              title="Reject"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {aiBullets.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-2">All suggestions used!</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Suggestions from past CVs */}
      {suggestions.workExperiences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-lg border border-primary/20 bg-mint-50"
        >
          <div className="flex items-start gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Relevant Work Experience</p>
              <p className="text-xs text-gray-600 mt-1">Select past roles that match this job target. Click to add them quickly.</p>
            </div>
          </div>
          <div className="space-y-2">
            {suggestions.workExperiences.slice(0, 3).map((exp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setEntries((prev) => [...prev, {
                    id: Date.now().toString() + idx,
                    position: exp.position,
                    company: exp.company,
                    startDate: exp.startDate,
                    endDate: exp.endDate,
                    responsibilities: exp.responsibilities,
                  }]);
                }}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <p className="text-sm font-medium text-gray-900">{exp.position}</p>
                <p className="text-xs text-gray-600">{exp.company}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <button
        onClick={() => setEntries((prev) => [...prev, newEntry()])}
        className="mt-4 flex items-center gap-2 text-sm text-primary hover:underline font-medium"
      >
        <Plus className="w-4 h-4" /> Add another position
      </button>

      <div className="flex justify-between mt-8 pb-6 lg:pb-0 gap-3">
        <Button variant="outline" size="md" onClick={prevStep} className="hidden lg:inline-flex">← Previous</Button>
        <Button size="lg" onClick={handleNext} className="w-full lg:w-auto">Save & Continue →</Button>
      </div>
    </motion.div>
  );
}
