import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Palette, Expand } from 'lucide-react';
import { TEMPLATES, resolveOptions } from '../../components/templates';
import TemplateCustomizer from '../../components/templates/TemplateCustomizer';
import PreviewModal from '../../components/builder/PreviewModal';
import { useBuilder } from '../../context/BuilderContext';
import { Button } from '../../components/ui/Button';
import { sampleResumeData } from '../../services/mockData';

const PREVIEW_SCALE = 0.33;

export default function ChooseTemplatePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useBuilder();
  const [selected, setSelected] = useState(state.templateId || 'classic');
  const [showModal, setShowModal] = useState(false);

  // Use builder data if available, otherwise show sample data
  const previewData = state.contactDetails.fullName ? state : sampleResumeData;

  const handleContinue = () => {
    dispatch({ type: 'SET_TEMPLATE', payload: selected });
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/">
          <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">
            {TEMPLATES.find(t => t.id === selected)?.name} selected
          </span>
          <Button size="md" onClick={handleContinue}>
            Continue with {TEMPLATES.find(t => t.id === selected)?.name} →
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-mint-50 border border-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Palette className="w-3.5 h-3.5" />
            Choose Your Style
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pick a Template</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            All templates use the same content — swap anytime. You can change this after building too.
          </p>
        </motion.div>

        {/* Template grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
          {TEMPLATES.map((tpl, i) => {
            const isSelected = selected === tpl.id;
            const Template = tpl.component;
            return (
              <motion.button
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setSelected(tpl.id)}
                className={`relative text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden group ${
                  isSelected
                    ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Template preview thumbnail */}
                <div className="overflow-hidden bg-gray-50" style={{ height: 260 }}>
                  <div className="origin-top-left pointer-events-none">
                    <Template data={previewData} scale={PREVIEW_SCALE} options={resolveOptions(tpl.id, state.templateCustomizations)} />
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-3 bg-white border-t border-gray-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{tpl.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{tpl.tag}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{tpl.description}</p>
                </div>

                {/* Selected overlay badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Selected
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Detail preview of selected template + customizer */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">
                {TEMPLATES.find(t => t.id === selected)?.name} Preview
              </h2>
              <p className="text-sm text-gray-400">{TEMPLATES.find(t => t.id === selected)?.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModal(true)}
                title="Full preview"
                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Expand className="w-4 h-4" />
              </button>
              <Button size="md" onClick={handleContinue}>
                Use This Template →
              </Button>
            </div>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Design controls */}
            <div className="lg:w-60 shrink-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Design Options</p>
              <TemplateCustomizer templateId={selected} onExpand={() => setShowModal(true)} />
            </div>

            {/* Large preview */}
            <div className="flex-1 overflow-auto rounded-xl border border-gray-100 bg-gray-50 flex justify-center p-4">
              {(() => {
                const tpl = TEMPLATES.find(t => t.id === selected)!;
                const Template = tpl.component;
                return <Template data={previewData} scale={0.65} options={resolveOptions(selected, state.templateCustomizations)} />;
              })()}
            </div>
          </div>
        </motion.div>
      </div>

      {showModal && (
        <PreviewModal
          data={previewData}
          templateId={selected}
          customizations={state.templateCustomizations}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
