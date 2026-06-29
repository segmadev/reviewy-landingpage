import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Plus } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useBuilder } from '../../../context/BuilderContext';
import { useToast } from '../../../context/ToastContext';
import { getAISkillSuggestions } from '../../../services/api';
import { useCVSuggestions } from '../../../hooks/useCVSuggestions';

export default function Step5Skills() {
  const { state, dispatch, nextStep, prevStep } = useBuilder();
  const { error: showError } = useToast();
  const { suggestions: cvSuggestions } = useCVSuggestions();
  const [skills, setSkills] = useState<string[]>(state.skills.length ? state.skills : []);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [custom, setCustom] = useState('');

  useEffect(() => {
    if (!state.jobDescription) return;

    let cancelled = false;
    setLoadingSuggestions(true);

    getAISkillSuggestions(state.jobDescription, skills, conversationId)
      .then((response) => {
        if (!cancelled) {
          const newSuggestions = response.items.filter((s) => !skills.includes(s));
          setSuggestions(newSuggestions);
          setReasoning(response.reasoning);
          setConversationId(response.conversationId);
          setLoadingSuggestions(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to get AI suggestions:', error);
          showError('Failed to load AI suggestions');
          setLoadingSuggestions(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
      setSuggestions((prev) => prev.filter((s) => s !== skill));
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
    setSuggestions((prev) => [...prev, skill]);
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !skills.includes(trimmed)) {
      addSkill(trimmed);
      setCustom('');
    }
  };

  const handleNext = () => {
    dispatch({ type: 'SET_SKILLS', payload: skills });
    nextStep();
  };

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Skills</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">Add the skills that best represent your expertise.</p>

      {/* Current skills */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Your Skills</label>
        <div className="min-h-[60px] p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-wrap gap-2">
          <AnimatePresence>
            {skills.map((skill) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium"
              >
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          {skills.length === 0 && (
            <span className="text-gray-400 text-sm">Click suggestions below to add skills…</span>
          )}
        </div>
      </div>

      {/* Custom skill input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Skill</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Kubernetes, Figma, SQL…"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            className="flex-1 px-3 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none text-sm"
          />
          <Button size="md" variant="outline" onClick={addCustom}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Past Skills Suggestions */}
      {cvSuggestions.skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg border border-primary/20 bg-mint-50"
        >
          <div className="flex items-start gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Your Proven Skills</p>
              <p className="text-xs text-gray-600 mt-1">Select relevant skills you've used in past roles. Click to add them for this job.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {cvSuggestions.skills.filter((s) => !skills.includes(s)).slice(0, 8).map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 text-xs font-medium bg-white hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                + {skill}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
          {loadingSuggestions && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full ml-1"
            />
          )}
        </div>
        {reasoning && (
          <p className="text-xs text-gray-500 mb-2 italic">{reasoning}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.03 }}
              onClick={() => addSkill(s)}
              className="px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium bg-mint-50 hover:bg-primary hover:text-white transition-colors"
            >
              + {s}
            </motion.button>
          ))}
          {!loadingSuggestions && suggestions.length === 0 && (
            <p className="text-xs text-gray-400">All suggestions added!</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8 pb-6 lg:pb-0 gap-3">
        <Button variant="outline" size="md" onClick={prevStep} className="hidden lg:inline-flex">
          ← Previous
        </Button>
        <Button size="lg" onClick={handleNext} disabled={skills.length === 0} className="w-full lg:w-auto">
          Save & Continue →
        </Button>
      </div>
    </motion.div>
  );
}
