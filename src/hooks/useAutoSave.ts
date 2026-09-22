import { useEffect, useRef, useState } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { saveBuilderStep } from '../services/api';
import { STORAGE_KEYS } from '../config/api.config';
import { deleteAnonymousDraft } from '../services/anonymousSession';
import { getStoredBuilderUserId, hasBuilderProgress, LEGACY_BUILDER_CACHE_KEY, loadBuilderDraft, saveBuilderDraft } from '../services/builderDraftStorage';

export const BUILDER_CACHE_KEY = LEGACY_BUILDER_CACHE_KEY;
const inFlightSaves = new Map<string, Promise<string>>();

export async function waitForBuilderSave(owner: string, draftId: string): Promise<string | undefined> {
  return inFlightSaves.get(`${owner}:${draftId}`);
}

// Starting another CV must not delete any existing draft or reuse its server ID.
export function clearBuilderDraftTracking(): void {
  localStorage.removeItem(STORAGE_KEYS.RESUMED_ID);
  localStorage.removeItem(LEGACY_BUILDER_CACHE_KEY);
}

export function useAutoSave() {
  const { state, dispatch } = useBuilder();
  const { isAuthenticated, user } = useAuth();
  const { error: showError } = useToast();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [revision, setRevision] = useState(0);
  const previousOwner = useRef(getStoredBuilderUserId());
  const skipSnapshot = useRef(false);
  const running = useRef(false);
  const saved = useRef(new Map<string, string>());
  const serverIds = useRef(new Map<string, string>());
  const latest = useRef({ state, owner: user?.id });

  useEffect(() => {
    latest.current = { state, owner: user?.id };
    const owner = user?.id ?? null;
    // Login can be authenticated before the profile request supplies a user ID.
    if (isAuthenticated && !owner) return;
    const previous = previousOwner.current;
    if (previous === owner) return;
    previousOwner.current = owner;
    skipSnapshot.current = true;
    if (!owner) {
      dispatch({ type: 'NEW_CV' });
    } else if (!previous && hasBuilderProgress(state)) {
      saveBuilderDraft(owner, state);
      deleteAnonymousDraft();
      skipSnapshot.current = false;
    } else {
      const checkpoint = loadBuilderDraft(owner);
      dispatch(checkpoint ? { type: 'RESTORE_DRAFT', payload: checkpoint } : { type: 'NEW_CV' });
    }
  }, [state, user?.id, isAuthenticated, dispatch]);

  useEffect(() => {
    if (skipSnapshot.current) {
      skipSnapshot.current = false;
      return;
    }
    if (!isAuthenticated || !user?.id || state.isSubmitting || state.isComplete || !hasBuilderProgress(state)) return;
    const owner = user.id;
    const key = `${owner}:${state.draftId}`;
    const fingerprint = JSON.stringify(state);
    if (saved.current.get(key) === fingerprint) return;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(async () => {
      // One write at a time: a slow create must never produce a second resume.
      if (running.current || getStoredBuilderUserId() !== owner) return;
      running.current = true;
      setSaveStatus('saving');
      try {
        const request = saveBuilderStep(state.submittedCvId || serverIds.current.get(key) || '', state);
        inFlightSaves.set(key, request);
        const id = await request;
        serverIds.current.set(key, id);
        saved.current.set(key, fingerprint);
        const checkpoint = loadBuilderDraft(owner, state.draftId);
        if (checkpoint) saveBuilderDraft(owner, { ...checkpoint, submittedCvId: id }, false);
        const active = latest.current;
        if (getStoredBuilderUserId() === owner && active.owner === owner && active.state.draftId === state.draftId && !active.state.submittedCvId && !active.state.isSubmitting) {
          dispatch({ type: 'SET_SUBMITTED', payload: id });
        }
        setSaveStatus('saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
        showError('Your draft is saved on this device. Server sync failed; reconnect and try again.');
        retry = setTimeout(() => setRevision(value => value + 1), 10000);
      } finally {
        inFlightSaves.delete(key);
        running.current = false;
        // Reconsider the latest snapshot, including edits made during the request.
        if (!retry) setRevision(value => value + 1);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
      if (retry) clearTimeout(retry);
    };
  }, [state, user?.id, isAuthenticated, dispatch, showError, revision]);

  return { saveStatus };
}
