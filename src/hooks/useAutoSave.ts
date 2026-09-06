import { useEffect, useRef, useState } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { saveBuilderStep } from '../services/api';
import { STORAGE_KEYS } from '../config/api.config';
import { saveAnonymousDraft } from '../services/anonymousSession';

const AUTOSAVE_DELAY = 1000; // 1 second debounce
export const BUILDER_CACHE_KEY = 'rym_builder_cache';

// Clears this hook's in-progress resume-id tracking. Must be called whenever the
// user explicitly starts a brand-new CV (dispatching NEW_CV) — otherwise the
// resume id left over from whatever was being edited/autosaved before stays in
// localStorage and the next autosave tick silently reuses it, patching the wrong
// resume on the backend instead of creating a new one.
export function clearBuilderDraftTracking(): void {
  localStorage.removeItem(STORAGE_KEYS.RESUMED_ID);
  localStorage.removeItem(BUILDER_CACHE_KEY);
}

export function useAutoSave() {
  const { state, dispatch } = useBuilder();
  const { isAuthenticated } = useAuth();
  const { error: showError } = useToast();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    // For authenticated users: Don't autosave until Step 1 (Job Targeting) is complete (only for new CVs)
    if (isAuthenticated) {
      const isNewCV = !state.submittedCvId;
      if (isNewCV && (!state.jobDescription || state.jobDescription.trim() === '')) return;
    }

    // Create a hash of the current state to detect changes
    const stateHash = JSON.stringify({
      contactDetails: state.contactDetails,
      linkedinProfile: state.linkedinProfile,
      portfolioLinks: state.portfolioLinks,
      professionalSummary: state.professionalSummary,
      skills: state.skills,
      workExperience: state.workExperience,
      education: state.education,
      relevantCourseWork: state.relevantCourseWork,
      certifications: state.certifications,
      references: state.references,
      languages: state.languages,
      awards: state.awards,
      hobbies: state.hobbies,
      jobDescription: state.jobDescription,
      toggles: state.toggles,
    });

    // Only autosave if state changed
    if (stateHash === lastSavedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setSaveStatus('saving');

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(async () => {
      try {
        // Always save to localStorage cache for quick restoration (Steps 3-7 only)
        const cacheData = {
          workExperience: state.workExperience,
          education: state.education,
          relevantCourseWork: state.relevantCourseWork,
          certifications: state.certifications,
          references: state.references,
          skills: state.skills,
          professionalSummary: state.professionalSummary,
          languages: state.languages,
          awards: state.awards,
          hobbies: state.hobbies,
          toggles: state.toggles,
          linkedinProfile: state.linkedinProfile,
          portfolioLinks: state.portfolioLinks,
          jobDescription: state.jobDescription,
          templateId: state.templateId,
          templateCustomizations: state.templateCustomizations,
          timestamp: Date.now(),
        };
        localStorage.setItem(BUILDER_CACHE_KEY, JSON.stringify(cacheData));

        if (isAuthenticated) {
          // Save to backend for authenticated users.
          // state.submittedCvId is the authoritative id for "which resume is loaded"
          // (set by LOAD_CV when opening an existing resume, or by this hook itself
          // once autosave creates one) — it must take priority over the localStorage
          // slot below, which only exists to survive a debounce/unmount between the
          // first autosave tick and state catching up, and can otherwise go stale
          // and leak into a different resume's autosave after switching CVs.
          const resumeId = state.submittedCvId || localStorage.getItem(STORAGE_KEYS.RESUMED_ID) || '';
          const newResumeId = await saveBuilderStep(resumeId, state);

          // Store resume ID for next saves, and keep state in sync so subsequent
          // ticks (and any other code reading state.submittedCvId) see it too.
          localStorage.setItem(STORAGE_KEYS.RESUMED_ID, newResumeId);
          if (newResumeId && newResumeId !== state.submittedCvId) {
            dispatch({ type: 'SET_SUBMITTED', payload: newResumeId });
          }
        } else {
          // Save to localStorage for anonymous users
          saveAnonymousDraft(state);
        }

        lastSavedRef.current = stateHash;
        setSaveStatus('saved');

        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
        showError('Failed to save CV. Will retry automatically.');
      }
    }, AUTOSAVE_DELAY);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state, isAuthenticated, showError]);

  return { saveStatus };
}
