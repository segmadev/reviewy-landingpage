import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check, Expand, BookOpen, Zap, Award, Minimize2, PanelLeft,
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

  const previewData = state.contactDetails.fullName ? state : sampleResumeData;
  const selectedTemplate = TEMPLATES.find(t => t.id === selected) ?? TEMPLATES[0];
  const opts = resolveOptions(selected, state.templateCustomizations);

  const handleUseTemplate = () => {
    dispatch({ type: 'SET_TEMPLATE', payload: selected });
    navigate('/builder');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F3F4F6' }}>
      <DashboardSidebar />

      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-white"
          style={{ borderColor: '#E5E7EB' }}
        >
          <div>
            <h1 className="text-lg font-bold text-gray-900">Templates</h1>
            <p className="text-xs text-gray-400 mt-0.5">Choose a template for your CV</p>
          </div>
          <button
            onClick={handleUseTemplate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: '#68AE24' }}
          >
            Use {selectedTemplate.name} Template →
          </button>
        </div>

        {/* Body: two-column */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left: template list */}
          <div
            className="w-[300px] shrink-0 overflow-y-auto border-r py-4 px-3"
            style={{ borderColor: '#E5E7EB', background: '#FAFBF9' }}
          >
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-3">
              {TEMPLATES.length} Templates
            </p>
            <div className="space-y-1.5">
              {TEMPLATES.map(tpl => {
                const isActive = selected === tpl.id;
                return (
                  <motion.button
                    key={tpl.id}
                    onClick={() => setSelected(tpl.id)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left"
                    style={{
                      background: isActive ? 'rgba(104,174,36,0.1)' : 'transparent',
                      border: isActive ? '1.5px solid rgba(104,174,36,0.3)' : '1.5px solid transparent',
                    }}
                  >
                    {/* Icon in colored box */}
                    <div
                      className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ background: tpl.accentColor }}
                    >
                      {isActive
                        ? <Check className="w-4 h-4 text-white" />
                        : (() => { const Icon = TEMPLATE_ICONS[tpl.id] ?? BookOpen; return <Icon className="w-4 h-4 text-white/80" />; })()
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isActive ? 'text-[#58AF24]' : 'text-gray-800'}`}>
                        {tpl.name}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{tpl.tag}</p>
                    </div>
                    {isActive && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: '#EDF2E9', color: '#3a7c10' }}
                      >
                        Selected
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: live CV preview */}
          <div
            className="flex-1 overflow-hidden flex flex-col items-center justify-start py-6 px-8"
            style={{ background: '#F6F8F7' }}
          >
            {/* Template info bar */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ background: selectedTemplate.accentColor }}
                />
                <div>
                  <p className="text-sm font-bold text-gray-900">{selectedTemplate.name}</p>
                  <p className="text-[11px] text-gray-400">{selectedTemplate.description}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
              >
                <Expand className="w-3.5 h-3.5" />
                Fullscreen
              </button>
            </div>

            {/* Preview */}
            <div className="w-full overflow-auto rounded-xl shadow-md" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              <CVPreview
                data={previewData}
                scale={0.7}
                templateId={selected}
                customizations={state.templateCustomizations}
              />
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
