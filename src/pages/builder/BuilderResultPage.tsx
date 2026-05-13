import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Edit3, FilePlus, LayoutDashboard,
  User, FileText, GraduationCap, Briefcase,
  Lightbulb, Award, CheckCircle2, Expand, Layers,
} from 'lucide-react';
import CVPreview from '../../components/builder/CVPreview';
import PreviewModal from '../../components/builder/PreviewModal';
import DownloadMenu from '../../components/ui/DownloadMenu';
import { useBuilder } from '../../context/BuilderContext';
import { sampleResumeData } from '../../services/mockData';
import { upsertCV, generateCVId } from '../../services/cvLibrary';
import type { SavedCV } from '../../types/resume';

const STEPS = [
  { icon: FileText,       label: 'Template'    },
  { icon: User,           label: 'Contact'     },
  { icon: FileText,       label: 'Summary'     },
  { icon: Briefcase,      label: 'Experience'  },
  { icon: GraduationCap,  label: 'Education'   },
  { icon: Lightbulb,      label: 'Skills'      },
  { icon: Award,          label: 'Extras'      },
];

export default function BuilderResultPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useBuilder();

  const printRef   = useRef<HTMLDivElement>(null); // hidden full-scale for download
  const [showModal, setShowModal] = useState(false);

  const cvData = state.contactDetails.fullName ? state : sampleResumeData;
  const cvName = state.contactDetails.fullName ? `${state.contactDetails.fullName}'s CV` : 'My CV';

  const persistCV = (): SavedCV => {
    const cvId = state.submittedCvId ?? generateCVId();
    const saved: SavedCV = {
      id: cvId, name: cvName,
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
    upsertCV(saved);
    return saved;
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (< lg)  — vertical stack
      ════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col min-h-screen lg:hidden">

        {/* Mobile top bar — green completion banner */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ background: '#58AF24' }}>
          <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-6 w-auto brightness-0 invert" />
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-5 h-5" style={{ color: '#d4f5a0' }} />
            <span className="text-sm font-bold">All {STEPS.length} steps done!</span>
          </div>
        </div>

        {/* Mobile step progress pills */}
        <div
          className="flex gap-1.5 px-5 py-3 overflow-x-auto"
          style={{ background: '#4a9e1c' }}
        >
          {STEPS.map(({ label }, i) => (
            <span
              key={label}
              className="text-[10px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full shrink-0"
              style={{
                background: i === STEPS.length - 1 ? '#71CD00' : 'rgba(255,255,255,0.2)',
                color: '#fff',
              }}
            >
              ✓ {label}
            </span>
          ))}
        </div>

        {/* Mobile action card */}
        <div className="px-4 py-5" style={{ background: '#4B5563' }}>
          <div className="text-center mb-5">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2" style={{ color: '#71CD00' }} />
            <h1 className="text-xl font-bold text-white">Your CV is ready!</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Download, edit, or go to your dashboard.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Download */}
            <DownloadMenu
              printRef={printRef as React.RefObject<HTMLElement | null>}
              filename={cvName}
              label="Download CV"
              className="w-full justify-center py-3 rounded-xl font-semibold text-sm"
              triggerStyle={{ background: '#71CD00', color: '#1a1a1a' }}
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/builder')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                style={{ border: '2px solid #71CD00', color: '#71CD00' }}
              >
                <Edit3 className="w-4 h-4" /> Edit CV
              </button>
              <button
                onClick={() => { persistCV(); navigate('/dashboard/templates'); }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <Layers className="w-4 h-4" /> Template
              </button>
            </div>

            <button
              onClick={() => { persistCV(); navigate('/dashboard'); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <LayoutDashboard className="w-4 h-4" /> My CVs Dashboard
            </button>

            <button
              onClick={() => { dispatch({ type: 'NEW_CV' }); navigate('/builder'); }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <FilePlus className="w-4 h-4" /> Create another CV
            </button>
          </div>
        </div>

        {/* Mobile CV preview */}
        <div className="flex-1 px-4 py-5" style={{ background: '#F6F8F7' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">CV Preview</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Expand className="w-3.5 h-3.5" /> Fullscreen
            </button>
          </div>
          <div className="w-full overflow-auto rounded-xl shadow-md">
            <CVPreview
              data={cvData}
              scale={0.55}
              templateId={state.templateId}
              customizations={state.templateCustomizations}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (lg+)  — 3 horizontal panels, full screen height
      ════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex h-screen overflow-hidden">

        {/* Left: green steps sidebar */}
        <div
          className="w-[220px] xl:w-[250px] shrink-0 flex flex-col py-8 px-4 overflow-y-auto"
          style={{ background: '#58AF24' }}
        >
          <img
            src="/asstes/onwhite-logo.png"
            alt="ReviewyMe"
            className="h-7 w-auto brightness-0 invert mb-8 self-start"
          />
          <div className="space-y-1">
            {STEPS.map(({ icon: Icon, label }, i) => {
              const isLast = i === STEPS.length - 1;
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={isLast ? { background: '#71CD00' } : {}}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    {isLast
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      : <Icon className="w-3 h-3 text-white/70" />}
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: '#fff', fontWeight: isLast ? 700 : 400, opacity: isLast ? 1 : 0.75 }}
                  >
                    {label}
                  </span>
                  {!isLast && <CheckCircle2 className="w-3 h-3 ml-auto text-white/50" />}
                </motion.div>
              );
            })}
          </div>
          <div className="mt-auto pt-6 text-center">
            <p className="text-white/50 text-[11px]">All steps complete</p>
            <p className="text-white font-bold text-sm mt-1">🎉 Great job!</p>
          </div>
        </div>

        {/* Middle: action panel */}
        <div
          className="w-[320px] xl:w-[380px] shrink-0 flex flex-col items-center justify-center px-7 gap-5 overflow-y-auto py-8"
          style={{ background: '#4B5563' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, delay: 0.35 }}
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(113,205,0,0.2)' }}
            >
              <CheckCircle2 className="w-7 h-7" style={{ color: '#71CD00' }} />
            </motion.div>
            <h1 className="text-xl font-bold text-white mb-1.5">Your CV is ready!</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Download it, tweak the design, or head to your dashboard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="w-full space-y-2.5"
          >
            <DownloadMenu
              printRef={printRef as React.RefObject<HTMLElement | null>}
              filename={cvName}
              label="Download CV"
              className="w-full justify-center py-3 rounded-xl font-semibold text-sm"
              triggerStyle={{ background: '#71CD00', color: '#1a1a1a' }}
            />

            <button
              onClick={() => navigate('/builder')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
              style={{ border: '2px solid #71CD00', color: '#71CD00' }}
            >
              <Edit3 className="w-4 h-4" /> Edit CV
            </button>

            <button
              onClick={() => { persistCV(); navigate('/dashboard/templates'); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm hover:bg-white/10 transition-colors"
              style={{ color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <Layers className="w-4 h-4" /> Change Template
            </button>

            <button
              onClick={() => { persistCV(); navigate('/dashboard'); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm hover:bg-white/10 transition-colors"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              <LayoutDashboard className="w-4 h-4" /> My CVs Dashboard
            </button>

            <button
              onClick={() => { dispatch({ type: 'NEW_CV' }); navigate('/builder'); }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <FilePlus className="w-4 h-4" /> Create another CV
            </button>
          </motion.div>
        </div>

        {/* Right: CV preview */}
        <div
          className="flex-1 flex flex-col px-8 py-6 overflow-hidden"
          style={{ background: '#F6F8F7' }}
        >
          <div className="flex items-center justify-between mb-4 shrink-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">CV Preview</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Expand className="w-3.5 h-3.5" /> Full screen
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 overflow-auto rounded-xl shadow-lg"
          >
            <CVPreview
              data={cvData}
              scale={0.7}
              templateId={state.templateId}
              customizations={state.templateCustomizations}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Hidden full-scale element for all downloads ────── */}
      <div
        ref={printRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: -9999,
          left: 0,
          width: 794,
          pointerEvents: 'none',
        }}
      >
        <CVPreview
          data={cvData}
          scale={1}
          templateId={state.templateId}
          customizations={state.templateCustomizations}
        />
      </div>

      {showModal && (
        <PreviewModal
          data={cvData}
          templateId={state.templateId}
          customizations={state.templateCustomizations}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
