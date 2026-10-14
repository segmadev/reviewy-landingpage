import { useCallback, useRef, useState } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { saveBuilderOnContinue } from './useAutoSave';

/** Saves one validated builder step to the backend, then advances exactly once. */
export function useSaveAndContinue() {
  const { state, dispatch } = useBuilder();
  const { isAuthenticated, user } = useAuth();
  const { error: showError } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const saving = useRef(false);

  const saveAndContinue = useCallback(async () => {
    if (saving.current) return false;

    // Guest drafts remain device-local until registration/login.
    if (!isAuthenticated) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
      return true;
    }

    if (!user?.id) {
      showError('Your account is still loading. Please try again.');
      return false;
    }

    saving.current = true;
    setIsSaving(true);
    try {
      const nextStep = state.currentStep + 1;
      const resumeId = await saveBuilderOnContinue(user.id, { ...state, currentStep: nextStep });
      dispatch({ type: 'SET_SUBMITTED', payload: resumeId });
      dispatch({ type: 'SET_STEP', payload: nextStep });
      return true;
    } catch (error) {
      console.error('Save & Continue failed:', error);
      showError('Your draft is saved on this device, but could not be saved to the server. Please try again.');
      return false;
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  }, [dispatch, isAuthenticated, showError, state, user?.id]);

  return { saveAndContinue, isSaving };
}
