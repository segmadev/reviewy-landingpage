import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useBuilder } from '../../../context/BuilderContext';
import type { Certification, Reference } from '../../../types/resume';

function newCert(): Certification {
  return { id: Date.now().toString(), title: '', issuer: '', date: '' };
}
function newRef(): Reference {
  return { id: Date.now().toString(), name: '', position: '', company: '', contact: '' };
}

export default function Step7Additional() {
  const { state, dispatch, nextStep, prevStep } = useBuilder();
  const [languages, setLanguages] = useState<string[]>(state.languages ?? []);
  const [certs, setCerts] = useState<Certification[]>(state.certifications ?? []);
  const [awards, setAwards] = useState<string[]>(state.awards ?? []);
  const [hobbies, setHobbies] = useState<string[]>(state.hobbies ?? []);
  const [refs, setRefs] = useState<Reference[]>(state.references ?? []);

  const [langInput, setLangInput] = useState('');
  const [awardInput, setAwardInput] = useState('');
  const [hobbyInput, setHobbyInput] = useState('');

  const toggles = state.toggles;

  const handleNext = () => {
    dispatch({ type: 'SET_LANGUAGES', payload: languages });
    dispatch({ type: 'SET_CERTIFICATIONS', payload: certs });
    dispatch({ type: 'SET_AWARDS', payload: awards });
    dispatch({ type: 'SET_HOBBIES', payload: hobbies });
    dispatch({ type: 'SET_REFERENCES', payload: refs });
    nextStep();
  };

  const sections = [
    { key: 'languages' as const, label: 'Languages', emoji: '🌐' },
    { key: 'certifications' as const, label: 'Certifications', emoji: '🏅' },
    { key: 'awards' as const, label: 'Awards', emoji: '🏆' },
    { key: 'hobbies' as const, label: 'Interests & Hobbies', emoji: '🎯' },
    { key: 'references' as const, label: 'References', emoji: '👤' },
  ];

  return (
    <motion.div
      key="step7"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Additional Information</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">Toggle the sections you'd like to include in your CV.</p>

      <div className="space-y-3">
        {sections.map(({ key, label, emoji }) => (
          <div key={key} className="rounded-xl border border-gray-200 overflow-hidden">
            {/* Toggle row */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SECTION', payload: key })}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{emoji}</span>
                <span className="font-medium text-gray-800 text-sm">{label}</span>
              </div>
              <div
                className={`w-10 h-5.5 rounded-full transition-colors flex items-center px-0.5 ${
                  toggles[key] ? 'bg-primary justify-end' : 'bg-gray-200 justify-start'
                }`}
                style={{ height: 22 }}
              >
                <motion.div
                  layout
                  className="w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            </button>

            {/* Expanded content */}
            <AnimatePresence>
              {toggles[key] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                    {key === 'languages' && (
                      <PillInput
                        placeholder='e.g. "English (Native)"'
                        value={langInput}
                        onChange={setLangInput}
                        items={languages}
                        onAdd={() => { if (langInput.trim()) { setLanguages([...languages, langInput.trim()]); setLangInput(''); } }}
                        onRemove={(i) => setLanguages(languages.filter((_, idx) => idx !== i))}
                      />
                    )}
                    {key === 'certifications' && (
                      <div className="space-y-3 mt-3">
                        {certs.map((cert) => (
                          <div key={cert.id} className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Certification title" value={cert.title}
                              onChange={(e) => setCerts(certs.map(c => c.id === cert.id ? { ...c, title: e.target.value } : c))}
                              className="col-span-2 px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-xs" />
                            <input type="text" placeholder="Issuing body" value={cert.issuer}
                              onChange={(e) => setCerts(certs.map(c => c.id === cert.id ? { ...c, issuer: e.target.value } : c))}
                              className="px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-xs" />
                            <input type="month" value={cert.date.slice(0,7)}
                              onChange={(e) => setCerts(certs.map(c => c.id === cert.id ? { ...c, date: e.target.value + '-01' } : c))}
                              className="px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-xs" />
                          </div>
                        ))}
                        <button onClick={() => setCerts([...certs, newCert()])}
                          className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <Plus className="w-3 h-3" /> Add certification
                        </button>
                      </div>
                    )}
                    {key === 'awards' && (
                      <PillInput
                        placeholder='e.g. "National Award 2023"'
                        value={awardInput}
                        onChange={setAwardInput}
                        items={awards}
                        onAdd={() => { if (awardInput.trim()) { setAwards([...awards, awardInput.trim()]); setAwardInput(''); } }}
                        onRemove={(i) => setAwards(awards.filter((_, idx) => idx !== i))}
                      />
                    )}
                    {key === 'hobbies' && (
                      <PillInput
                        placeholder='e.g. "Rock Climbing"'
                        value={hobbyInput}
                        onChange={setHobbyInput}
                        items={hobbies}
                        onAdd={() => { if (hobbyInput.trim()) { setHobbies([...hobbies, hobbyInput.trim()]); setHobbyInput(''); } }}
                        onRemove={(i) => setHobbies(hobbies.filter((_, idx) => idx !== i))}
                      />
                    )}
                    {key === 'references' && (
                      <div className="space-y-3 mt-3">
                        {refs.map((ref) => (
                          <div key={ref.id} className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Full name" value={ref.name}
                              onChange={(e) => setRefs(refs.map(r => r.id === ref.id ? { ...r, name: e.target.value } : r))}
                              className="col-span-2 px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-xs" />
                            <input type="text" placeholder="Position" value={ref.position}
                              onChange={(e) => setRefs(refs.map(r => r.id === ref.id ? { ...r, position: e.target.value } : r))}
                              className="px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-xs" />
                            <input type="text" placeholder="Company" value={ref.company}
                              onChange={(e) => setRefs(refs.map(r => r.id === ref.id ? { ...r, company: e.target.value } : r))}
                              className="px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-xs" />
                            <input type="email" placeholder="Contact email" value={ref.contact}
                              onChange={(e) => setRefs(refs.map(r => r.id === ref.id ? { ...r, contact: e.target.value } : r))}
                              className="col-span-2 px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-xs" />
                          </div>
                        ))}
                        <button onClick={() => setRefs([...refs, newRef()])}
                          className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <Plus className="w-3 h-3" /> Add reference
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8 pb-6 lg:pb-0 gap-3">
        <Button variant="outline" size="md" onClick={prevStep} className="hidden lg:inline-flex">← Previous</Button>
        <Button size="lg" onClick={handleNext} className="w-full lg:w-auto">Finish & Review →</Button>
      </div>
    </motion.div>
  );
}

function PillInput({ placeholder, value, onChange, items, onAdd, onRemove }: {
  placeholder: string; value: string; onChange: (v: string) => void;
  items: string[]; onAdd: () => void; onRemove: (i: number) => void;
}) {
  return (
    <div className="mt-3">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary focus:outline-none text-xs"
        />
        <button onClick={onAdd}
          className="px-3 py-2 rounded-lg bg-primary text-white text-xs hover:bg-primary-hover">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {item}
            <button onClick={() => onRemove(i)} className="hover:opacity-70">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
