import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, User, Mail, Phone, MapPin, Linkedin, Globe,
  Code, FileText, Check, X, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useBuilder } from '../../../context/BuilderContext';
import { extractFromText, hasExtractions, countExtractions } from '../../../services/extractCvData';
import type { ExtractionResult } from '../../../services/extractCvData';

// ── per-field metadata ──────────────────────────────────────────────────────
type FieldKey = keyof ExtractionResult;

const FIELD_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  name:         { label: 'Name',        icon: User,     color: '#6366f1' },
  email:        { label: 'Email',       icon: Mail,     color: '#0ea5e9' },
  phone:        { label: 'Phone',       icon: Phone,    color: '#10b981' },
  address:      { label: 'Location',    icon: MapPin,   color: '#f59e0b' },
  linkedinUrl:  { label: 'LinkedIn',    icon: Linkedin, color: '#0077b5' },
  portfolioUrls:{ label: 'Portfolio',   icon: Globe,    color: '#8b5cf6' },
  skills:       { label: 'Skills',      icon: Code,     color: '#65B026' },
  summary:      { label: 'Summary',     icon: FileText, color: '#64748b' },
};

function fieldValue(key: string, result: ExtractionResult): string {
  if (key === 'portfolioUrls') return (result.portfolioUrls ?? []).join(', ');
  if (key === 'skills') return (result.skills ?? []).slice(0, 5).join(', ') + ((result.skills?.length ?? 0) > 5 ? ` +${(result.skills?.length ?? 0) - 5} more` : '');
  if (key === 'summary') {
    const s = result.summary ?? '';
    return s.length > 80 ? s.slice(0, 80) + '…' : s;
  }
  return (result as Record<string, unknown>)[key] as string ?? '';
}

// ── AutoFillCard ─────────────────────────────────────────────────────────────
function AutoFillCard({
  result,
  onApply,
  onDismiss,
}: {
  result: ExtractionResult;
  onApply: (selected: ExtractionResult) => void;
  onDismiss: () => void;
}) {
  const allKeys = Object.keys(FIELD_META).filter(k => {
    const v = (result as Record<string, unknown>)[k];
    return v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : String(v).trim().length > 0);
  }) as FieldKey[];

  const [selected, setSelected] = useState<Set<string>>(new Set(allKeys));
  const [showSkills, setShowSkills] = useState(false);

  const toggle = (k: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });

  const handleApply = () => {
    const partial: Partial<ExtractionResult> = {};
    for (const k of selected) {
      (partial as Record<string, unknown>)[k] = (result as Record<string, unknown>)[k];
    }
    onApply(partial as ExtractionResult);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="mt-4 rounded-2xl border border-primary/25 bg-mint-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/15">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {countExtractions(result)} details detected — select which to auto-fill
          </p>
        </div>
        <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Field chips */}
      <div className="p-4 space-y-2">
        {allKeys.map(k => {
          const meta = FIELD_META[k];
          if (!meta) return null;
          const Icon = meta.icon;
          const isSelected = selected.has(k);
          const val = fieldValue(k, result);
          const isSkills = k === 'skills';

          return (
            <div key={k}>
              <button
                onClick={() => toggle(k)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-primary/40 bg-white shadow-sm'
                    : 'border-transparent bg-white/50 opacity-50'
                }`}
              >
                {/* Color icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: meta.color + '18' }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                </div>

                {/* Label + value */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 leading-none mb-0.5">{meta.label}</p>
                  <p className="text-xs text-gray-700 font-medium truncate">{val}</p>
                </div>

                {/* Check */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? 'bg-primary border-primary' : 'border-gray-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>

              {/* Expandable skills list */}
              {isSkills && isSelected && (result.skills?.length ?? 0) > 0 && (
                <div className="ml-10 mt-1">
                  <button
                    onClick={() => setShowSkills(v => !v)}
                    className="flex items-center gap-1 text-[10px] text-primary font-medium hover:underline"
                  >
                    {showSkills ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showSkills ? 'Hide' : 'Show'} all {result.skills?.length} skills
                  </button>
                  <AnimatePresence>
                    {showSkills && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {result.skills?.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{s}</span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">{selected.size} of {allKeys.length} fields selected</p>
        <button
          onClick={handleApply}
          disabled={selected.size === 0}
          className="flex items-center gap-2 bg-primary disabled:opacity-40 hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors shadow-sm shadow-primary/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Apply Auto-fill
        </button>
      </div>
    </motion.div>
  );
}

// ── Step 1 ───────────────────────────────────────────────────────────────────
export default function Step1JobTargeting() {
  const { state, dispatch, nextStep } = useBuilder();
  const [value, setValue] = useState(state.jobDescription);
  const [extracted, setExtracted] = useState<ExtractionResult | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [applied, setApplied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Run extraction with debounce whenever text changes
  useEffect(() => {
    setDismissed(false);
    setApplied(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 30) {
      setExtracted(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = extractFromText(value);
      setExtracted(hasExtractions(result) ? result : null);
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const handleApply = (selection: ExtractionResult) => {
    dispatch({ type: 'AUTOFILL', payload: selection });
    setApplied(true);
    setDismissed(true);
  };

  const handleNext = () => {
    dispatch({ type: 'SET_JOB_DESCRIPTION', payload: value });
    nextStep();
  };

  const showCard = extracted && !dismissed && !applied;

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
        rows={4}
        placeholder="Paste job URL, job description, or your existing CV text here…"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:outline-none transition-colors text-sm text-gray-800 placeholder:text-gray-300 resize-none leading-relaxed"
      />

      {/* Applied success banner */}
      <AnimatePresence>
        {applied && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20"
          >
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm font-medium text-primary">Fields auto-filled successfully — you can review them in each step.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-fill card */}
      <AnimatePresence>
        {showCard && (
          <AutoFillCard
            result={extracted}
            onApply={handleApply}
            onDismiss={() => setDismissed(true)}
          />
        )}
      </AnimatePresence>

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
