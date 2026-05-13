import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import CVPreview from './CVPreview';
import type { ResumeData } from '../../types/resume';
import type { TemplateOptions } from '../templates/utils';

interface Props {
  data: Partial<ResumeData>;
  templateId: string;
  customizations: Record<string, Partial<TemplateOptions>>;
  onClose: () => void;
}

const SCALES = [0.5, 0.65, 0.8, 1.0];

export default function PreviewModal({ data, templateId, customizations, onClose }: Props) {
  const [scaleIdx, setScaleIdx] = useState(2); // default 0.8
  const scale = SCALES[scaleIdx];

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900/90 shrink-0 border-b border-white/10">
        <span className="text-sm font-semibold text-white/80 tracking-wide">Full Preview</span>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setScaleIdx(i => Math.max(0, i - 1))}
              disabled={scaleIdx === 0}
              className="p-1 rounded hover:bg-white/20 text-white disabled:opacity-30 transition-all"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-white/70 font-mono w-10 text-center select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScaleIdx(i => Math.min(SCALES.length - 1, i + 1))}
              disabled={scaleIdx === SCALES.length - 1}
              className="p-1 rounded hover:bg-white/20 text-white disabled:opacity-30 transition-all"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-all"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable preview area */}
      <div
        className="flex-1 overflow-auto flex justify-center py-8 px-4"
        onClick={onClose}
      >
        <div onClick={e => e.stopPropagation()}>
          <CVPreview
            data={data}
            scale={scale}
            templateId={templateId}
            customizations={customizations}
          />
        </div>
      </div>

      <p className="text-center text-xs text-white/30 py-2 shrink-0">
        Click outside or press Esc to close
      </p>
    </div>,
    document.body,
  );
}
