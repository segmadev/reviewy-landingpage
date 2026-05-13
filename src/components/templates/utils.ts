export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export interface TemplateOptions {
  accentColor: string;        // highlight colour – dates, borders, bullets, icons
  headerBg: string;           // header panel bg (Executive) / sidebar bg (Sidebar)
  fontFamily: 'serif' | 'sans' | 'custom';
  customFontName?: string;    // only used when fontFamily === 'custom'
  spacing: 'compact' | 'normal' | 'spacious';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  fontSize: 'small' | 'normal' | 'large' | 'custom';
  customFontSize?: number;    // base pt size when fontSize === 'custom' (e.g. 10, 11, 12)
}

export const FONT_MAP = {
  serif: '"PT Serif", Georgia, "Times New Roman", serif',
  sans:  'Inter, "Segoe UI", system-ui, -apple-system, sans-serif',
};

/** Resolves the CSS font-family string, honouring 'custom'. */
export function getFontFamily(opts: TemplateOptions): string {
  if (opts.fontFamily === 'custom') {
    const name = opts.customFontName?.trim();
    return name ? `"${name}", ${FONT_MAP.sans}` : FONT_MAP.sans;
  }
  return FONT_MAP[opts.fontFamily] ?? FONT_MAP.sans;
}

export const SPACING_SCALE: Record<TemplateOptions['spacing'], number> = {
  compact: 0.72,
  normal: 1.0,
  spacious: 1.32,
};

export const LINE_HEIGHT_SCALE: Record<TemplateOptions['lineHeight'], number> = {
  tight: 1.2,
  normal: 1.45,
  relaxed: 1.7,
};

export const FONT_SIZE_SCALE = {
  small: 0.88,
  normal: 1.0,
  large: 1.14,
};

/** Resolves the font-size scale multiplier, honouring 'custom'. */
export function getFontSizeScale(opts: TemplateOptions): number {
  if (opts.fontSize === 'custom') {
    const pt = opts.customFontSize;
    return (pt && pt > 0) ? pt / 10 : 1.0;
  }
  return FONT_SIZE_SCALE[opts.fontSize as keyof typeof FONT_SIZE_SCALE] ?? 1.0;
}

export const ACCENT_SWATCHES = [
  { label: 'Leaf',    value: '#65B026' },
  { label: 'Sky',     value: '#3B82F6' },
  { label: 'Violet',  value: '#7C3AED' },
  { label: 'Rose',    value: '#E11D48' },
  { label: 'Amber',   value: '#D97706' },
  { label: 'Teal',    value: '#0D9488' },
  { label: 'Navy',    value: '#1e40af' },
  { label: 'Ink',     value: '#111827' },
  { label: 'Coral',   value: '#F43F5E' },
  { label: 'Indigo',  value: '#4338ca' },
];

export const HEADER_SWATCHES = [
  { label: 'Navy',     value: '#1e293b' },
  { label: 'Ink',      value: '#111827' },
  { label: 'Forest',   value: '#14532d' },
  { label: 'Maroon',   value: '#7f1d1d' },
  { label: 'Indigo',   value: '#312e81' },
  { label: 'Slate',    value: '#334155' },
  { label: 'Plum',     value: '#4a044e' },
  { label: 'Brown',    value: '#431407' },
];
