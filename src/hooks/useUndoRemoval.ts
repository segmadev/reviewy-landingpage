import { useCallback, useEffect, useRef, useState } from 'react';

export const UNDO_WINDOW_MS = 60_000;

export interface PendingUndo {
  label: string;
  expiresAt: number;
  restore: () => void;
}

export function useUndoRemoval() {
  const [pending, setPending] = useState<PendingUndo | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const dismiss = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    setPending(null);
  }, []);

  const register = useCallback((label: string, restore: () => void) => {
    window.clearTimeout(timeoutRef.current);
    setPending({ label, expiresAt: Date.now() + UNDO_WINDOW_MS, restore });
    timeoutRef.current = window.setTimeout(() => setPending(null), UNDO_WINDOW_MS);
  }, []);

  const undo = useCallback(() => {
    pending?.restore();
    dismiss();
  }, [pending, dismiss]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return { pending, register, undo, dismiss };
}
