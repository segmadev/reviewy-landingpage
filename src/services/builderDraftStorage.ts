import { STORAGE_KEYS } from '../config/api.config';
import type { BuilderState } from '../context/BuilderContext';
import type { SavedCV } from '../types/resume';

const USER_DRAFTS_KEY = 'reviewyme_user_cv_drafts_v1';
export const LEGACY_BUILDER_CACHE_KEY = 'rym_builder_cache';

interface StoredBuilderDraft {
  savedAt: number;
  state: BuilderState;
}

type UserDraftStore = Record<string, StoredBuilderDraft & { drafts?: Record<string, StoredBuilderDraft> }>;

function readStore(): UserDraftStore {
  try {
    const raw = localStorage.getItem(USER_DRAFTS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as UserDraftStore : {};
  } catch (error) {
    console.error('Failed to read saved CV drafts:', error);
    return {};
  }
}

function writeStore(store: UserDraftStore): void {
  try {
    localStorage.setItem(USER_DRAFTS_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('Failed to save CV draft:', error);
  }
}

export function getStoredBuilderUserId(): string | null {
  try {
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!rawUser || rawUser === 'undefined' || rawUser === 'null') return null;

    const user = JSON.parse(rawUser) as { id?: unknown };
    return typeof user.id === 'string' && user.id ? user.id : null;
  } catch {
    return null;
  }
}

export function saveBuilderDraft(userId: string, state: BuilderState, activate = true): void {
  const store = readStore();
  const previous = store[userId];
  const drafts = { ...previous?.drafts };
  if (previous?.state) drafts[previous.state.draftId || previous.state.submittedCvId || 'default'] = { savedAt: previous.savedAt, state: previous.state };
  const checkpoint = { savedAt: Date.now(), state: { ...state, isSubmitting: false } };
  drafts[state.draftId || state.submittedCvId || 'default'] = checkpoint;
  store[userId] = {
    drafts,
    savedAt: Date.now(),
    state: {
      ...state,
      currentStep: Math.min(Math.max(state.currentStep, 1), 7),
      isSubmitting: false,
    },
  };
  if (!activate && previous?.state && previous.state.draftId !== state.draftId) {
    store[userId].state = previous.state;
    store[userId].savedAt = previous.savedAt;
  }
  writeStore(store);
}

export function loadBuilderDraft(userId: string, resumeId?: string): BuilderState | null {
  const draft = readStore()[userId];
  if (!draft?.state) return null;

  if (resumeId && draft.state.submittedCvId !== resumeId && draft.state.draftId !== resumeId) {
    return Object.values(draft.drafts || {}).find(item => item.state.submittedCvId === resumeId || item.state.draftId === resumeId)?.state || null;
  }
  return draft.state;
}

export function clearBuilderDraft(userId: string | null, resumeId?: string): void {
  if (!userId) return;

  const store = readStore();
  if (!(userId in store)) return;

  if (resumeId) {
    const account = store[userId];
    const drafts = Object.fromEntries(Object.entries(account.drafts || {}).filter(([, draft]) => draft.state.draftId !== resumeId && draft.state.submittedCvId !== resumeId));
    if (account.state.draftId === resumeId || account.state.submittedCvId === resumeId) {
      const remaining = Object.values(drafts).sort((a, b) => b.savedAt - a.savedAt)[0];
      if (remaining) store[userId] = { ...remaining, drafts };
      else delete store[userId];
    } else account.drafts = drafts;
  } else delete store[userId];
  writeStore(store);
}

export function mergeBuilderDrafts(userId: string, resumes: SavedCV[], offline = false): SavedCV[] {
  const account = readStore()[userId];
  if (!account?.state) return resumes;
  const checkpoints = { ...account.drafts, [account.state.draftId]: { state: account.state, savedAt: account.savedAt } };
  const merged = new Map(resumes.map(cv => [cv.id, cv]));
  for (const { state, savedAt } of Object.values(checkpoints)) {
    if (!hasBuilderProgress(state)) continue;
    const id = state.submittedCvId || state.draftId;
    const existing = merged.get(id);
    // Server-backed drafts deleted elsewhere should not be resurrected from this device.
    if (state.submittedCvId && !existing && !offline) continue;
    merged.set(id, {
      ...state,
      id,
      name: existing?.name || (state.contactDetails.fullName ? `${state.contactDetails.fullName}'s CV` : 'Untitled CV'),
      templateCustomizations: state.templateCustomizations as SavedCV['templateCustomizations'],
      languages: state.languages || [], awards: state.awards || [], hobbies: state.hobbies || [],
      createdAt: existing?.createdAt || new Date(savedAt).toISOString(),
      updatedAt: new Date(savedAt).toISOString(),
      isDraft: true,
    });
  }
  return [...merged.values()];
}

export function hasBuilderProgress(state: BuilderState): boolean {
  return (
    state.currentStep > 1 ||
    state.jobDescription.trim().length > 0 ||
    Object.entries(state.contactDetails).some(
      ([key, value]) => key !== 'country' && typeof value === 'string' && value.trim().length > 0
    ) ||
    state.linkedinProfile.trim().length > 0 ||
    state.portfolioLinks.some((value) => value.trim().length > 0) ||
    state.workExperience.some((entry) =>
      entry.position.trim().length > 0 ||
      entry.company.trim().length > 0 ||
      entry.responsibilities.some((item) => item.trim().length > 0)
    ) ||
    state.education.some((entry) =>
      entry.institution.trim().length > 0 || entry.degree.trim().length > 0
    ) ||
    state.skills.length > 0 ||
    state.professionalSummary.trim().length > 0 ||
    (state.languages?.length ?? 0) > 0 ||
    (state.certifications?.length ?? 0) > 0 ||
    (state.awards?.length ?? 0) > 0 ||
    (state.hobbies?.length ?? 0) > 0 ||
    (state.references?.length ?? 0) > 0
  );
}
