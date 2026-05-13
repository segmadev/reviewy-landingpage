import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, FileText, Image, FileType2, Loader2 } from 'lucide-react';
import { downloadAsPDF, downloadAsDoc, downloadAsImage } from '../../services/downloadCV';

interface Props {
  /** Ref to the FULL-SCALE (unscaled) CV element used for image/PDF capture */
  printRef: React.RefObject<HTMLElement | null>;
  filename?: string;
  /** Optional className for the trigger button */
  className?: string;
  /** Optional inline style for the trigger button */
  triggerStyle?: React.CSSProperties;
  /** Button label — defaults to "Download" */
  label?: string;
}

const FORMATS = [
  { id: 'pdf',   icon: FileText,  label: 'PDF Document',  sub: '.pdf via print' },
  { id: 'doc',   icon: FileType2, label: 'Word Document',  sub: '.doc'           },
  { id: 'image', icon: Image,     label: 'PNG Image',      sub: '.png'           },
] as const;

export default function DownloadMenu({ printRef, filename = 'My CV', className = '', triggerStyle, label = 'Download' }: Props) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const handleFormat = async (fmt: 'pdf' | 'doc' | 'image') => {
    if (!printRef.current) return;
    setLoading(fmt);
    setOpen(false);
    try {
      if (fmt === 'pdf')   downloadAsPDF(printRef.current, filename);
      if (fmt === 'doc')   downloadAsDoc(printRef.current, filename);
      if (fmt === 'image') await downloadAsImage(printRef.current, filename);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        disabled={!!loading}
        className={`flex items-center gap-2 font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60 ${className}`}
        style={triggerStyle}
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Download className="w-4 h-4" />}
        {loading ? 'Preparing…' : label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[200px]"
          >
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1.5">
              Download as
            </p>
            {FORMATS.map(({ id, icon: Icon, label: fmtLabel, sub }) => (
              <button
                key={id}
                onClick={() => handleFormat(id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(104,174,36,0.1)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#58AF24' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{fmtLabel}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
