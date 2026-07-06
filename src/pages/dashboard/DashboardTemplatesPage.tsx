import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Expand, BookOpen, Zap, Award, Minimize2, PanelLeft, Menu, X,
} from 'lucide-react';

// Template-specific icons (matched by template id)
const TEMPLATE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  classic:   BookOpen,
  modern:    Zap,
  executive: Award,
  minimal:   Minimize2,
  sidebar:   PanelLeft,
};
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import CVPreview from '../../components/builder/CVPreview';
import PreviewModal from '../../components/builder/PreviewModal';
import { TEMPLATES, resolveOptions } from '../../components/templates';
import { useBuilder } from '../../context/BuilderContext';
import { sampleResumeData } from '../../services/mockData';

export default function DashboardTemplatesPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useBuilder();
  const [selected, setSelected] = useState(state.templateId || 'classic');
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const previewData = state.contactDetails.fullName ? state : sampleResumeData;
  const selectedTemplate = TEMPLATES.find(t => t.id === selected) ?? TEMPLATES[0];
  const opts = resolveOptions(selected, state.templateCustomizations);

  const handleUseTemplate = () => {
    dispatch({ type: 'SET_TEMPLATE', payload: selected });
    navigate('/builder');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F3F4F6' }}>
      {/* Desktop Sidebar */}
      <div className="hidden sm:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/50 z-30 sm:hidden"
            />
            {/* Drawer - slides from left */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-40 sm:hidden overflow-y-auto"
            >
              <DashboardSidebar isMobile={true} onItemClick={closeMobileMenu} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0 bg-white"
          style={{ borderColor: '#E5E7EB' }}
        >
          <div className="flex items-center justify-between w-full">
            {/* Title - Left on all sizes */}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-gray-900">Templates</h1>
              <p className="text-xs text-gray-400 mt-0.5">Choose a template for your CV</p>
            </div>

            {/* Mobile Menu Button - Right on mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-3"
              title="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>

          {/* Use Template Button - Below on mobile, right on tablet+ */}
          <button
            onClick={handleUseTemplate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
            style={{ background: '#68AE24' }}
          >
            Use Template →
          </button>
        </div>

        {/* Body: responsive layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

          {/* Left: template list */}
          <div
            className="w-full lg:w-[280px] lg:shrink-0 overflow-y-auto border-b lg:border-r lg:border-b-0 py-3 sm:py-4 px-3 sm:px-4"
            style={{ borderColor: '#E5E7EB', background: '#FAFBF9', maxHeight: 'lg:auto', height: 'auto' }}
          >
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2 sm:mb-3">
              {TEMPLATES.length} Templates
            </p>
            <div className="space-y-1 sm:space-y-1.5 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-1.5">
              {TEMPLATES.map(tpl => {
                const isActive = selected === tpl.id;
                return (
                  <motion.button
                    key={tpl.id}
                    onClick={() => setSelected(tpl.id)}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-left"
                    style={{
                      background: isActive ? 'rgba(104,174,36,0.1)' : 'transparent',
                      border: isActive ? '1.5px solid rgba(104,174,36,0.3)' : '1.5px solid transparent',
                    }}
                  >
                    {/* Icon in colored box */}
                    <div
                      className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ background: tpl.accentColor }}
                    >
                      {isActive
                        ? <Check className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                        : (() => { const Icon = TEMPLATE_ICONS[tpl.id] ?? BookOpen; return <Icon className="w-3 sm:w-4 h-3 sm:h-4 text-white/80" />; })()
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold ${isActive ? 'text-[#58AF24]' : 'text-gray-800'}`}>
                        {tpl.name}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{tpl.tag}</p>
                    </div>
                    {isActive && (
                      <span
                        className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: '#EDF2E9', color: '#3a7c10' }}
                      >
                        ✓
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: live CV preview - Desktop only */}
          <div
            className="hidden lg:flex flex-1 overflow-hidden flex-col items-center justify-start py-4 sm:py-6 px-4 sm:px-8"
            style={{ background: '#F6F8F7' }}
          >
            {/* Template info bar */}
            <div className="w-full flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div
                  className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg shrink-0"
                  style={{ background: selectedTemplate.accentColor }}
                />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{selectedTemplate.name}</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">{selectedTemplate.description}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors shrink-0"
              >
                <Expand className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>

            {/* Preview */}
            <div className="w-full overflow-auto rounded-xl shadow-md flex-1" style={{ maxHeight: 'calc(100vh - 180px)' }}>
              <CVPreview
                data={previewData}
                scale={0.65}
                templateId={selected}
                customizations={state.templateCustomizations}
              />
            </div>
          </div>

          {/* Mobile: Template details + preview */}
          <div
            className="flex lg:hidden flex-col flex-1 overflow-y-auto py-4 px-4"
            style={{ background: '#F6F8F7' }}
          >
            {/* Selected template info */}
            <div className="mb-4 p-4 rounded-xl border" style={{ borderColor: '#E5E7EB', background: '#fff' }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: selectedTemplate.accentColor }}
                >
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{selectedTemplate.name}</p>
                  <p className="text-xs text-gray-400">{selectedTemplate.description}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{selectedTemplate.tag}</p>
            </div>

            {/* Mobile preview */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full overflow-auto rounded-xl shadow-md" style={{ maxHeight: '500px' }}>
                <CVPreview
                  data={previewData}
                  scale={0.5}
                  templateId={selected}
                  customizations={state.templateCustomizations}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <PreviewModal
          data={previewData}
          templateId={selected}
          customizations={{ [selected]: opts }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
