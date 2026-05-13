import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye, EyeOff, SlidersHorizontal, Expand, ChevronLeft, X,
  Check, Target, Phone, Briefcase, GraduationCap, Lightbulb,
  AlignLeft, PlusCircle, Trophy, Palette, LayoutDashboard,
} from 'lucide-react';
import { useBuilder } from '../../context/BuilderContext';
import { TEMPLATES } from '../../components/templates';
import TemplateCustomizer from '../../components/templates/TemplateCustomizer';
import BuilderSidebar from '../../components/builder/BuilderSidebar';
import CVPreview from '../../components/builder/CVPreview';
import PreviewModal from '../../components/builder/PreviewModal';
import Step1JobTargeting from '../../components/builder/steps/Step1JobTargeting';
import Step2Contact from '../../components/builder/steps/Step2Contact';
import Step3WorkHistory from '../../components/builder/steps/Step3WorkHistory';
import Step4Education from '../../components/builder/steps/Step4Education';
import Step5Skills from '../../components/builder/steps/Step5Skills';
import Step6Summary from '../../components/builder/steps/Step6Summary';
import Step7Additional from '../../components/builder/steps/Step7Additional';
import { submitCV } from '../../services/api';
import { upsertCV, generateCVId, clearActiveCV } from '../../services/cvLibrary';
import type { SavedCV } from '../../types/resume';

const DARK_PANEL = '#1c1c1e';

const ALL_STEPS = [
  { num: 1, label: 'Job Targeting',       icon: Target       },
  { num: 2, label: 'CV Contact',           icon: Phone        },
  { num: 3, label: 'Work History',         icon: Briefcase    },
  { num: 4, label: 'Education',            icon: GraduationCap},
  { num: 5, label: 'Skills',               icon: Lightbulb    },
  { num: 6, label: 'Professional Summary', icon: AlignLeft    },
  { num: 7, label: 'Additional Info',      icon: PlusCircle   },
  { num: 8, label: 'Result',               icon: Trophy       },
];

// ── Mobile bottom-sheet backdrop + container ──────────────────────────────────
function BottomSheet({
  open,
  onClose,
  children,
  maxHeight = '85vh',
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 bg-white rounded-t-2xl z-50 lg:hidden flex flex-col overflow-hidden"
            style={{ maxHeight }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function BuilderInner() {
  const navigate = useNavigate();
  const { state, dispatch, prevStep, nextStep, goToStep } = useBuilder();
  const [showPreview,    setShowPreview]    = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showModal,      setShowModal]      = useState(false);
  const [showSteps,      setShowSteps]      = useState(false);
  const [showDesign,     setShowDesign]     = useState(false);

  const currentStep = state.currentStep;

  const stepComponents: Record<number, React.ReactElement> = {
    1: <Step1JobTargeting />,
    2: <Step2Contact />,
    3: <Step3WorkHistory />,
    4: <Step4Education />,
    5: <Step5Skills />,
    6: <Step6Summary />,
    7: <Step7Additional />,
  };

  const handleFinish = async () => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    // Persist to local CV library
    const cvId = state.submittedCvId ?? generateCVId();
    const savedCV: SavedCV = {
      id: cvId,
      name: state.contactDetails.fullName
        ? `${state.contactDetails.fullName}'s CV`
        : 'My CV',
      templateId: state.templateId,
      templateCustomizations: state.templateCustomizations as Record<string, Record<string, unknown>>,
      contactDetails: state.contactDetails,
      linkedinProfile: state.linkedinProfile,
      portfolioLinks: state.portfolioLinks,
      professionalSummary: state.professionalSummary,
      skills: state.skills,
      workExperience: state.workExperience,
      education: state.education,
      relevantCourseWork: state.relevantCourseWork,
      certifications: state.certifications,
      references: state.references,
      languages: state.languages ?? [],
      awards: state.awards ?? [],
      hobbies: state.hobbies ?? [],
      jobDescription: state.jobDescription,
      toggles: state.toggles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    upsertCV(savedCV);
    clearActiveCV();
    await submitCV(state as any);
    dispatch({ type: 'SET_SUBMITTED', payload: cvId });
    navigate('/builder/result');
  };

  const handleNext = () => {
    if (currentStep >= 7) handleFinish();
    else nextStep();
  };

  React.useEffect(() => {
    if (currentStep > 7) handleFinish();
  }, [currentStep]);

  const currentTemplateName = TEMPLATES.find(t => t.id === state.templateId)?.name ?? 'Classic';

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Green sidebar (desktop only) */}
      <BuilderSidebar />

      {/* ── Main column ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Mobile top nav bar ──────────────────────────────── */}
        <div className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white shrink-0">
          {/* Dashboard icon */}
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
            title="Back to Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            onClick={() => currentStep > 1 && prevStep()}
            disabled={currentStep <= 1}
            className="flex items-center gap-0.5 text-sm font-semibold text-primary disabled:opacity-30 disabled:pointer-events-none shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Step indicator — tappable → steps sheet */}
          <button
            onClick={() => setShowSteps(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1"
          >
            <span className="text-xs font-bold text-gray-700">
              Step {Math.min(currentStep, 7)} / 7
            </span>
            <span className="text-[10px] text-gray-400">▾</span>
          </button>

          {/* Design + Preview */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowDesign(true)}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors"
              title="Design options"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowPreview(v => !v)}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors"
              title={showPreview ? 'Hide preview' : 'Preview CV'}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* ── Form area ─────────────────────────────────────── */}
          <div className={`flex-1 flex flex-col overflow-hidden ${showPreview ? 'hidden lg:flex' : ''}`}>

            {/* Desktop top bar: Dashboard link + Previous */}
            <div className="hidden lg:flex items-center justify-between px-10 pt-7 pb-2 shrink-0">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Step content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 lg:px-10 lg:py-6">
              <AnimatePresence mode="wait">
                {stepComponents[currentStep]}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Preview panel (desktop) ────────────────────────── */}
          <div
            className="hidden lg:flex w-[420px] xl:w-[460px] shrink-0 flex-col"
            style={{ backgroundColor: DARK_PANEL }}
          >
            {/* Top bar */}
            <div
              className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-1.5">
                {TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    title={tpl.name}
                    onClick={() => dispatch({ type: 'SET_TEMPLATE', payload: tpl.id })}
                    className="transition-all rounded-full"
                    style={{
                      width: 12, height: 12,
                      backgroundColor: tpl.accentColor,
                      border: state.templateId === tpl.id ? '2px solid white' : '2px solid transparent',
                      transform: state.templateId === tpl.id ? 'scale(1.35)' : 'scale(1)',
                      opacity: state.templateId === tpl.id ? 1 : 0.4,
                    }}
                  />
                ))}
                <span className="ml-1.5 text-[10px] font-medium text-white/30">{currentTemplateName}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowCustomizer(v => !v)}
                  title="Design options"
                  className={`p-1.5 rounded-lg transition-all ${
                    showCustomizer
                      ? 'bg-primary/30 text-white'
                      : 'text-white/30 hover:text-white/60 hover:bg-white/10'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  title="Full preview"
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/10 transition-all"
                >
                  <Expand className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Customizer drawer */}
            <AnimatePresence>
              {showCustomizer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden shrink-0"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="px-4 py-4 bg-[#f8f9fa] overflow-y-auto max-h-[55vh]">
                    <TemplateCustomizer
                      templateId={state.templateId}
                      onExpand={() => setShowModal(true)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CV preview */}
            <div className="flex-1 overflow-auto flex justify-center items-start py-6 px-4">
              <div className="shadow-2xl shadow-black/60">
                <CVPreview
                  data={state}
                  scale={0.52}
                  templateId={state.templateId}
                  customizations={state.templateCustomizations}
                />
              </div>
            </div>

            {/* Next button */}
            <div
              className="shrink-0 flex items-center justify-end px-5 py-4 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.07)', backgroundColor: DARK_PANEL }}
            >
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-7 py-2.5 rounded-full transition-colors shadow-lg shadow-primary/30"
              >
                {currentStep >= 7 ? 'Finish & Review' : 'Next'}
                {currentStep < 7 && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile preview overlay */}
          {showPreview && (
            <div className="lg:hidden flex-1 overflow-auto flex flex-col" style={{ backgroundColor: DARK_PANEL }}>
              {/* Template switcher in preview */}
              <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-1.5">
                  {TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      title={tpl.name}
                      onClick={() => dispatch({ type: 'SET_TEMPLATE', payload: tpl.id })}
                      className="transition-all rounded-full"
                      style={{
                        width: 14, height: 14,
                        backgroundColor: tpl.accentColor,
                        border: state.templateId === tpl.id ? '2px solid white' : '2px solid transparent',
                        transform: state.templateId === tpl.id ? 'scale(1.25)' : 'scale(1)',
                        opacity: state.templateId === tpl.id ? 1 : 0.45,
                      }}
                    />
                  ))}
                  <span className="ml-1 text-[10px] text-white/30 font-medium">{currentTemplateName}</span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/10 transition-all"
                >
                  <Expand className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 flex justify-center items-start py-6 px-4 overflow-auto">
                <div className="shadow-2xl shadow-black/60">
                  <CVPreview
                    data={state}
                    scale={0.45}
                    templateId={state.templateId}
                    customizations={state.templateCustomizations}
                  />
                </div>
              </div>
              <div className="shrink-0 flex justify-end px-5 pb-6">
                <button
                  onClick={() => { setShowPreview(false); handleNext(); }}
                  className="bg-primary text-white font-semibold text-sm px-7 py-2.5 rounded-full shadow-lg shadow-primary/30"
                >
                  {currentStep >= 7 ? 'Finish & Review' : 'Next →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile: Steps navigation sheet ───────────────────── */}
      <BottomSheet open={showSteps} onClose={() => setShowSteps(false)} maxHeight="75vh">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <p className="font-bold text-gray-900 text-base">All Steps</p>
          <button
            onClick={() => setShowSteps(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Step list */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {ALL_STEPS.map(({ num, label, icon: Icon }) => {
            const done   = num < currentStep;
            const active = num === currentStep;
            const locked = num > currentStep;
            return (
              <button
                key={num}
                disabled={locked}
                onClick={() => {
                  if (!locked) { goToStep(num); setShowSteps(false); }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  active  ? 'bg-primary/10 border border-primary/20' :
                  done    ? 'hover:bg-gray-50' :
                  'opacity-40 cursor-default'
                }`}
              >
                {/* Step badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    active ? 'bg-primary text-white' :
                    done   ? 'bg-primary/10 text-primary' :
                    'bg-gray-100 text-gray-400'
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${active ? 'text-primary' : done ? 'text-gray-800' : 'text-gray-400'}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {active ? 'Current step' : done ? 'Completed' : `Step ${num}`}
                  </p>
                </div>
                {/* Arrow for navigable steps */}
                {(done || active) && (
                  <svg className={`w-4 h-4 shrink-0 ${active ? 'text-primary' : 'text-gray-300'}`} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* ── Mobile: Design options sheet ──────────────────────── */}
      <BottomSheet open={showDesign} onClose={() => setShowDesign(false)} maxHeight="90vh">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="font-bold text-gray-900 text-base">Design Options</p>
            <p className="text-xs text-gray-400 mt-0.5">Customise your CV template</p>
          </div>
          <button
            onClick={() => setShowDesign(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template switcher row */}
        <div className="px-5 py-3 border-b border-gray-100 shrink-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Template</p>
          <div className="flex gap-2">
            {TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => dispatch({ type: 'SET_TEMPLATE', payload: tpl.id })}
                className={`flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all border ${
                  state.templateId === tpl.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span
                  className="block w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: tpl.accentColor }}
                />
                {tpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Customizer scrollable area */}
        <div className="overflow-y-auto flex-1 px-4 py-4">
          <TemplateCustomizer
            templateId={state.templateId}
            onExpand={() => { setShowDesign(false); setShowModal(true); }}
          />
        </div>
      </BottomSheet>

      {/* Full preview modal */}
      {showModal && (
        <PreviewModal
          data={state}
          templateId={state.templateId}
          customizations={state.templateCustomizations}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Submitting overlay */}
      {state.isSubmitting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-semibold text-white">Finalising your CV…</p>
          <p className="text-sm text-white/50 mt-1">This only takes a moment</p>
        </div>
      )}
    </div>
  );
}

export default function BuilderPage() {
  return <BuilderInner />;
}
