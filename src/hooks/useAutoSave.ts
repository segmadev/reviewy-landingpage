import { useEffect, useRef } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { saveBuilderStep } from '../services/api';
import { STORAGE_KEYS } from '../config/api.config';
import { deleteAnonymousDraft } from '../services/anonymousSession';
import { getStoredBuilderUserId, hasBuilderProgress, LEGACY_BUILDER_CACHE_KEY, loadBuilderDraft, saveBuilderDraft } from '../services/builderDraftStorage';
import type { BuilderState } from '../context/BuilderContext';

export const BUILDER_CACHE_KEY = LEGACY_BUILDER_CACHE_KEY;
const inFlightSaves = new Map<string, Promise<string>>();

export async function waitForBuilderSave(owner: string, draftId: string): Promise<string | undefined> {
  return inFlightSaves.get(`${owner}:${draftId}`);
}

/** Performs the one server write authorized by a Save & Continue click. */
export function saveBuilderOnContinue(owner: string, state: BuilderState): Promise<string> {
  const key = `${owner}:${state.draftId}`;
  const existing = inFlightSaves.get(key);
  if (existing) return existing;

  const request = saveBuilderStep(state.submittedCvId || '', state);
  inFlightSaves.set(key, request);
  const clearRequest = () => {
    if (inFlightSaves.get(key) === request) inFlightSaves.delete(key);
  };
  void request.then(clearRequest, clearRequest);
  return request;
}

// Starting another CV must not delete any existing draft or reuse its server ID.
export function clearBuilderDraftTracking(): void {
  localStorage.removeItem(STORAGE_KEYS.RESUMED_ID);
  localStorage.removeItem(LEGACY_BUILDER_CACHE_KEY);
}

export function useAutoSave() {
  const { state, dispatch } = useBuilder();
  const { isAuthenticated, user } = useAuth();
  const previousOwner = useRef(getStoredBuilderUserId());

  useEffect(() => {
    const owner = user?.id ?? null;
    // Login can be authenticated before the profile request supplies a user ID.
    if (isAuthenticated && !owner) return;
    const previous = previousOwner.current;
    if (previous === owner) return;
    previousOwner.current = owner;
    if (!owner) {
      dispatch({ type: 'NEW_CV' });
    } else if (!previous && hasBuilderProgress(state)) {
      saveBuilderDraft(owner, state);
      deleteAnonymousDraft();
    } else {
      const checkpoint = loadBuilderDraft(owner);
      dispatch(checkpoint ? { type: 'RESTORE_DRAFT', payload: checkpoint } : { type: 'NEW_CV' });
    }
  }, [state, user?.id, isAuthenticated, dispatch]);
}
