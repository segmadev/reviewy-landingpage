import { useState } from 'react';
import { RotateCcw, Expand, Type, Palette, Layout } from 'lucide-react';
import { ACCENT_SWATCHES, HEADER_SWATCHES } from './utils';
import type { TemplateOptions } from './utils';
import { useBuilder } from '../../context/BuilderContext';
import { getTemplate, resolveOptions } from './index';

const TEMPLATES_WITH_HEADER_BG = new Set(['executive', 'sidebar']);

interface Props {
  templateId: string;
  onExpand?: () => void;
}

// ── Swatch row with hex picker ────────────────────────────────────────────────
function SwatchRow({
  swatches,
  current,
  onChange,
  label,
}: {
  swatches: { label: string; value: string }[];
  current: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
        <label className="flex items-center gap-1.5 cursor-pointer group" title="Pick custom colour">
          <span
            className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300 group-hover:border-gray-500 transition-colors overflow-hidden shrink-0"
            style={{ backgroundColor: current }}
          >
            <input
              type="color"
              value={current}
              onChange={e => onChange(e.target.value)}
              className="opacity-0 absolute w-0 h-0"
            />
          </span>
          <span className="text-[10px] text-gray-400 group-hover:text-gray-600 font-mono transition-colors select-none">
            {current.toUpperCase()}
          </span>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {swatches.map(sw => (
          <button
            key={sw.value}
            title={sw.label}
            onClick={() => onChange(sw.value)}
            className="rounded-full transition-all duration-150 shrink-0"
            style={{
              width: 24,
              height: 24,
              backgroundColor: sw.value,
              border: current === sw.value ? '2.5px solid #111827' : '2px solid transparent',
              outline: current === sw.value ? '2px solid white' : 'none',
              outlineOffset: '-3px',
              transform: current === sw.value ? 'scale(1.2)' : 'scale(1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Toggle button group ───────────────────────────────────────────────────────
function SegmentGroup<T extends string>({
  options,
  value,
  onChange,
  renderLabel,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  renderLabel?: (v: T) => React.ReactNode;
}) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-2 text-[11px] font-semibold transition-all capitalize ${
            i > 0 ? 'border-l border-gray-200' : ''
          } ${
            value === opt
              ? 'bg-primary text-white shadow-inner'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          {renderLabel ? renderLabel(opt) : opt}
        </button>
      ))}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-primary" />
      </div>
      <p className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TemplateCustomizer({ templateId, onExpand }: Props) {
  const { state, dispatch } = useBuilder();
  const opts = resolveOptions(templateId, state.templateCustomizations);
  const [customFontDraft, setCustomFontDraft] = useState(opts.customFontName ?? '');
  const [customSizeDraft, setCustomSizeDraft] = useState(
    opts.customFontSize ? String(opts.customFontSize) : '10'
  );

  function patch(p: Partial<TemplateOptions>) {
    dispatch({ type: 'PATCH_TEMPLATE_OPTIONS', payload: { templateId, patch: p } });
  }

  function reset() {
    const tpl = getTemplate(templateId);
    setCustomFontDraft('');
    setCustomSizeDraft('10');
    dispatch({
      type: 'PATCH_TEMPLATE_OPTIONS',
      payload: { templateId, patch: tpl.defaultOptions },
    });
  }

  const showHeaderBg = TEMPLATES_WITH_HEADER_BG.has(templateId);

  return (
    <div className="space-y-5">

      {/* ── COLORS ─────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4">
        <SectionHeader icon={Palette} label="Colors" />

        <SwatchRow
          label="Accent Color"
          swatches={ACCENT_SWATCHES}
          current={opts.accentColor}
          onChange={v => patch({ accentColor: v })}
        />

        {showHeaderBg && (
          <SwatchRow
            label={templateId === 'sidebar' ? 'Sidebar Color' : 'Header Color'}
            swatches={HEADER_SWATCHES}
            current={opts.headerBg}
            onChange={v => patch({ headerBg: v })}
          />
        )}
      </div>

      {/* ── TYPOGRAPHY ─────────────────────────────── */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4">
        <SectionHeader icon={Type} label="Typography" />

        {/* Font style */}
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Font Style</p>
          <SegmentGroup
            options={['serif', 'sans', 'custom'] as const}
            value={opts.fontFamily}
            onChange={v => patch({ fontFamily: v })}
            renderLabel={v => v === 'serif' ? 'Serif' : v === 'sans' ? 'Sans' : 'Custom'}
          />
          {opts.fontFamily === 'custom' && (
            <div className="mt-2.5">
              <label className="block text-[10px] text-gray-400 mb-1.5">
                Font name — uses any font installed on this device or loaded via CSS
              </label>
              <input
                type="text"
                placeholder='e.g. "Lato", "Playfair Display"'
                value={customFontDraft}
                onChange={e => setCustomFontDraft(e.target.value)}
                onBlur={() => patch({ customFontName: customFontDraft })}
                onKeyDown={e => e.key === 'Enter' && patch({ customFontName: customFontDraft })}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none text-[12px] text-gray-800 placeholder:text-gray-300"
              />
            </div>
          )}
        </div>

        {/* Font size */}
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Font Size</p>
          <SegmentGroup
            options={['small', 'normal', 'large', 'custom'] as const}
            value={opts.fontSize}
            onChange={v => patch({ fontSize: v })}
            renderLabel={v => {
              if (v === 'small') return 'S';
              if (v === 'normal') return 'M';
              if (v === 'large') return 'L';
              return 'Custom';
            }}
          />
          {opts.fontSize === 'custom' && (
            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 mb-1.5">Base size (pt)</label>
                <input
                  type="number"
                  min={6}
                  max={16}
                  step={0.5}
                  placeholder="10"
                  value={customSizeDraft}
                  onChange={e => setCustomSizeDraft(e.target.value)}
                  onBlur={() => {
                    const n = parseFloat(customSizeDraft);
                    if (!isNaN(n) && n > 0) patch({ customFontSize: n });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none text-[12px] text-gray-800"
                />
              </div>
              <div className="flex gap-1.5 mt-5">
                {[8, 9, 10, 11, 12].map(pt => (
                  <button
                    key={pt}
                    onClick={() => { setCustomSizeDraft(String(pt)); patch({ customFontSize: pt }); }}
                    className={`w-8 h-7 rounded-lg text-[10px] font-bold border transition-all ${
                      Number(customSizeDraft) === pt
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LAYOUT ─────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4">
        <SectionHeader icon={Layout} label="Layout" />

        {/* Line height */}
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Line Height</p>
          <SegmentGroup
            options={['tight', 'normal', 'relaxed'] as const}
            value={opts.lineHeight}
            onChange={v => patch({ lineHeight: v })}
          />
        </div>

        {/* Spacing */}
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Section Spacing</p>
          <SegmentGroup
            options={['compact', 'normal', 'spacious'] as const}
            value={opts.spacing}
            onChange={v => patch({ spacing: v })}
          />
        </div>
      </div>

      {/* ── Actions ────────────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset defaults
        </button>
        {onExpand && (
          <button
            onClick={onExpand}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <Expand className="w-3 h-3" />
            Full preview
          </button>
        )}
      </div>
    </div>
  );
}
