import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useBuilder } from '../../../context/BuilderContext';
import { useCVSuggestions } from '../../../hooks/useCVSuggestions';
import type { Education } from '../../../types/resume';

const levels = ['Bachelors', 'Masters', 'Doctoral', 'HND / Diploma', 'A-Levels', 'Other'];

function newEntry(): Education {
  return { id: Date.now().toString(), institution: '', degree: '', startDate: '', endDate: '' };
}

export default function Step4Education() {
  const { state, dispatch, nextStep, prevStep } = useBuilder();
  const { suggestions } = useCVSuggestions();
  const [entries, setEntries] = useState<Education[]>(
    state.education.length > 0 ? state.education : [newEntry()]
  );
  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({});

  const update = (id: string, patch: Partial<Education>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const handleNext = () => {
    dispatch({ type: 'SET_EDUCATION', payload: entries });
    nextStep();
  };

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Education</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">Your academic qualifications and institutions.</p>

      <div className="space-y-6">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Education {idx + 1}
              </span>
              {entries.length > 1 && (
                <button
                  onClick={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))}
                  className="text-gray-400 hover:text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Level selector */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-2">Qualification Level</label>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevels({ ...selectedLevels, [entry.id]: level })}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      selectedLevels[entry.id] === level
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Institution</label>
                <input
                  type="text"
                  placeholder="Imperial College London"
                  value={entry.institution}
                  onChange={(e) => update(entry.id, { institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Degree / Field of Study</label>
                <input
                  type="text"
                  placeholder="MSc Advanced Computing (Distinction)"
                  value={entry.degree}
                  onChange={(e) => update(entry.id, { degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Graduation Date</label>
                  <input
                    type="month"
                    value={entry.endDate.slice(0, 7)}
                    onChange={(e) => update(entry.id, { endDate: e.target.value + '-01' })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions from past CVs */}
      {suggestions.educations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-lg border border-primary/20 bg-mint-50"
        >
          <div className="flex items-start gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Your Qualifications</p>
              <p className="text-xs text-gray-600 mt-1">Select relevant education for this job. Click to add qualifications.</p>
            </div>
          </div>
          <div className="space-y-2">
            {suggestions.educations.slice(0, 3).map((edu, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setEntries((prev) => [...prev, {
                    id: Date.now().toString() + idx,
                    institution: edu.institution,
                    degree: edu.degree,
                    startDate: edu.startDate,
                    endDate: edu.endDate,
                  }]);
                }}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                <p className="text-xs text-gray-600">{edu.institution}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <button
        onClick={() => setEntries((prev) => [...prev, newEntry()])}
        className="mt-4 flex items-center gap-2 text-sm text-primary hover:underline font-medium"
      >
        <Plus className="w-4 h-4" /> Add another education
      </button>

      <div className="flex justify-between mt-8 pb-6 lg:pb-0 gap-3">
        <Button variant="outline" size="md" onClick={prevStep} className="hidden lg:inline-flex">← Previous</Button>
        <Button size="lg" onClick={handleNext} className="w-full lg:w-auto">Save & Continue →</Button>
      </div>
    </motion.div>
  );
}
