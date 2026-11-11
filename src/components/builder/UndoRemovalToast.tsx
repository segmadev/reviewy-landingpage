import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { UNDO_WINDOW_MS, type PendingUndo } from '../../hooks/useUndoRemoval';

interface UndoRemovalToastProps {
  pending: PendingUndo | null;
  onUndo: () => void;
  onDismiss: () => void;
}

function secondsLeft(expiresAt: number) {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
}

export default function UndoRemovalToast({ pending, onUndo, onDismiss }: UndoRemovalToastProps) {
  return (
    <AnimatePresence>
      {pending && (
        <UndoRemovalBody key={pending.expiresAt} pending={pending} onUndo={onUndo} onDismiss={onDismiss} />
      )}
    </AnimatePresence>
  );
}

interface UndoRemovalBodyProps {
  pending: PendingUndo;
  onUndo: () => void;
  onDismiss: () => void;
}

function UndoRemovalBody({ pending, onUndo, onDismiss }: UndoRemovalBodyProps) {
  const [remaining, setRemaining] = useState(() => secondsLeft(pending.expiresAt));

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(secondsLeft(pending.expiresAt)), 250);
    return () => window.clearInterval(id);
  }, [pending.expiresAt]);

  const progress = Math.min(100, (remaining / (UNDO_WINDOW_MS / 1000)) * 100);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 overflow-hidden rounded-xl bg-gray-900 text-white shadow-lg"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1 truncate text-sm">
          Removed <span className="text-gray-300">&ldquo;{pending.label}&rdquo;</span>
        </p>
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <RotateCcw aria-hidden="true" className="w-3.5 h-3.5" />
          Undo
          <span className="tabular-nums text-gray-500">{remaining}s</span>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss undo"
          className="shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X aria-hidden="true" className="w-4 h-4" />
        </button>
      </div>
      <div className="h-0.5 bg-white/15">
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
