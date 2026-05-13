/**
 * CV Library — localStorage-based multi-CV persistence.
 * Drop-in replaceable with a real API when a backend is ready.
 */

import type { SavedCV } from '../types/resume';

const LIBRARY_KEY = 'rym_cv_library';
const ACTIVE_KEY  = 'rym_active_cv_id';

// ── CRUD ─────────────────────────────────────────────────────────────────────

export function loadLibrary(): SavedCV[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    return raw ? (JSON.parse(raw) as SavedCV[]) : [];
  } catch {
    return [];
  }
}

function persist(library: SavedCV[]): void {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
}

export function upsertCV(cv: SavedCV): void {
  const lib = loadLibrary();
  const idx = lib.findIndex(c => c.id === cv.id);
  if (idx >= 0) lib[idx] = cv;
  else lib.unshift(cv);
  persist(lib);
}

export function deleteCV(id: string): void {
  persist(loadLibrary().filter(c => c.id !== id));
  if (getActiveCVId() === id) clearActiveCV();
}

export function duplicateCV(id: string): SavedCV | null {
  const cv = loadLibrary().find(c => c.id === id);
  if (!cv) return null;
  const copy: SavedCV = {
    ...cv,
    id: `cv-${Date.now()}`,
    name: `${cv.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  upsertCV(copy);
  return copy;
}

export function renameCV(id: string, name: string): void {
  const lib = loadLibrary();
  const cv = lib.find(c => c.id === id);
  if (cv) { cv.name = name.trim() || cv.name; cv.updatedAt = new Date().toISOString(); }
  persist(lib);
}

// ── Active CV (which CV is currently loaded in the builder) ──────────────────

export function setActiveCV(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveCVId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function clearActiveCV(): void {
  localStorage.removeItem(ACTIVE_KEY);
}

export function getActiveCV(): SavedCV | null {
  const id = getActiveCVId();
  if (!id) return null;
  return loadLibrary().find(c => c.id === id) ?? null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function generateCVId(): string {
  return `cv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
