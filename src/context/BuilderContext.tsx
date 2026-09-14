import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import type { ResumeData, WorkExperience, Education, Certification, Reference, SavedCV } from '../types/resume';
import type { TemplateOptions } from '../components/templates/utils';
import type { ExtractionResult } from '../services/extractCvData';
import { sampleResumeData } from '../services/mockData';
import {
  getStoredBuilderUserId,
  LEGACY_BUILDER_CACHE_KEY,
  loadBuilderDraft,
  saveBuilderDraft,
  hasBuilderProgress,
} from '../services/builderDraftStorage';
import { getAnonymousDraft, saveAnonymousDraft } from '../services/anonymousSession';

export interface BuilderState extends ResumeData {
  draftId: string;
  draftInputs: { skill: string; language: string; award: string; hobby: string };
  currentStep: number;
  templateId: string;
  templateCustomizations: Record<string, Partial<TemplateOptions>>;
  jobDescription: string;
  toggles: {
    languages: boolean;
    certifications: boolean;
    awards: boolean;
    hobbies: boolean;
    references: boolean;
  };
  isSubmitting: boolean;
  submittedCvId: string | null;
}

const initialState: BuilderState = {
  draftId: '',
  draftInputs: { skill: '', language: '', award: '', hobby: '' },
  currentStep: 1,
  templateId: 'classic',
  templateCustomizations: {},
  jobDescription: '',
  toggles: {
    languages: false,
    certifications: false,
    awards: false,
    hobbies: false,
    references: false,
  },
  isSubmitting: false,
  submittedCvId: null,
  // Resume fields — start blank; populated as user progresses
  contactDetails: { fullName: '', address: '', city: '', postcode: '', phone: '', email: '', country: 'GB' },
  linkedinProfile: '',
  portfolioLinks: ['', ''],
  professionalSummary: '',
  skills: [],
  workExperience: [],
  education: [],
  relevantCourseWork: '',
  certifications: [],
  references: [],
  languages: [],
  awards: [],
  hobbies: [],
};

function normalizeStep(step: unknown): number {
  return typeof step === 'number' && Number.isFinite(step)
    ? Math.min(Math.max(Math.round(step), 1), 7)
    : 1;
}

function hydrateBuilderState(draft: Partial<BuilderState>): BuilderState {
  return {
    ...initialState,
    ...draft,
    draftId: draft.draftId || draft.submittedCvId || crypto.randomUUID(),
    draftInputs: { ...initialState.draftInputs, ...draft.draftInputs },
    currentStep: normalizeStep(draft.currentStep),
    contactDetails: { ...initialState.contactDetails, ...draft.contactDetails },
    toggles: { ...initialState.toggles, ...draft.toggles },
    templateCustomizations: draft.templateCustomizations || {},
    portfolioLinks: draft.portfolioLinks || ['', ''],
    isSubmitting: false,
  };
}

function inferResumeStep(cv: SavedCV): number {
  if (cv.currentStep) return normalizeStep(cv.currentStep);
  if (!(cv.jobDescription || cv.jobUrl)?.trim()) return 1;

  const contact = cv.contactDetails;
  const contactComplete = Boolean(
    contact?.fullName?.trim() &&
    contact.email?.trim() &&
    contact.phone?.trim() &&
    contact.address?.trim() &&
    contact.city?.trim() &&
    contact.postcode?.trim()
  );

  if (!contactComplete) return 2;
  if (!cv.workExperience?.length) return 3;
  if (!cv.education?.length) return 4;
  if (!cv.skills?.length) return 5;
  if (!cv.professionalSummary?.trim()) return 6;
  return 7;
}

function getInitialStateWithCache(): BuilderState {
  try {
    const storedUserId = getStoredBuilderUserId();
    const savedDraft = storedUserId
      ? loadBuilderDraft(storedUserId)
      : getAnonymousDraft();

    if (savedDraft) return hydrateBuilderState(savedDraft);

    const cached = localStorage.getItem(LEGACY_BUILDER_CACHE_KEY);
    if (!cached) return hydrateBuilderState({});

    const cacheData = JSON.parse(cached);
    return hydrateBuilderState(cacheData);
  } catch (error) {
    console.error('Failed to load builder cache:', error);
    return hydrateBuilderState({});
  }
}

type Action =
  | { type: 'REPLACE_STATE'; payload: BuilderState }
  | { type: 'UPDATE_FIELD'; update: (state: BuilderState) => BuilderState }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'PATCH_TEMPLATE_OPTIONS'; payload: { templateId: string; patch: Partial<TemplateOptions> } }
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'SET_CONTACT'; payload: BuilderState['contactDetails'] }
  | { type: 'SET_LINKEDIN'; payload: string }
  | { type: 'SET_PORTFOLIO'; payload: string[] }
  | { type: 'SET_WORK_EXPERIENCE'; payload: WorkExperience[] }
  | { type: 'SET_EDUCATION'; payload: Education[] }
  | { type: 'SET_SKILLS'; payload: string[] }
  | { type: 'SET_SUMMARY'; payload: string }
  | { type: 'SET_CERTIFICATIONS'; payload: Certification[] }
  | { type: 'SET_REFERENCES'; payload: Reference[] }
  | { type: 'SET_LANGUAGES'; payload: string[] }
  | { type: 'SET_AWARDS'; payload: string[] }
  | { type: 'SET_HOBBIES'; payload: string[] }
  | { type: 'TOGGLE_SECTION'; payload: keyof BuilderState['toggles'] }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMITTED'; payload: string }
  | { type: 'LOAD_SAMPLE' }
  | { type: 'AUTOFILL'; payload: ExtractionResult }
  | { type: 'LOAD_CV'; payload: SavedCV }
  | { type: 'RESTORE_DRAFT'; payload: BuilderState }
  | { type: 'NEW_CV' };

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'REPLACE_STATE': return action.payload;
    case 'UPDATE_FIELD': return action.update(state);
    case 'SET_STEP': return { ...state, currentStep: action.payload };
    case 'SET_TEMPLATE': return { ...state, templateId: action.payload };
    case 'PATCH_TEMPLATE_OPTIONS': return {
      ...state,
      templateCustomizations: {
        ...state.templateCustomizations,
        [action.payload.templateId]: {
          ...(state.templateCustomizations[action.payload.templateId] ?? {}),
          ...action.payload.patch,
        },
      },
    };
    case 'SET_JOB_DESCRIPTION': return { ...state, jobDescription: action.payload };
    case 'SET_CONTACT': return { ...state, contactDetails: action.payload };
    case 'SET_LINKEDIN': return { ...state, linkedinProfile: action.payload };
    case 'SET_PORTFOLIO': return { ...state, portfolioLinks: action.payload };
    case 'SET_WORK_EXPERIENCE': return { ...state, workExperience: action.payload };
    case 'SET_EDUCATION': return { ...state, education: action.payload };
    case 'SET_SKILLS': return { ...state, skills: action.payload };
    case 'SET_SUMMARY': return { ...state, professionalSummary: action.payload };
    case 'SET_CERTIFICATIONS': return { ...state, certifications: action.payload };
    case 'SET_REFERENCES': return { ...state, references: action.payload };
    case 'SET_LANGUAGES': return { ...state, languages: action.payload };
    case 'SET_AWARDS': return { ...state, awards: action.payload };
    case 'SET_HOBBIES': return { ...state, hobbies: action.payload };
    case 'TOGGLE_SECTION':
      return {
        ...state,
        toggles: { ...state.toggles, [action.payload]: !state.toggles[action.payload] },
      };
    case 'SET_SUBMITTING': return { ...state, isSubmitting: action.payload };
    case 'SET_SUBMITTED': return { ...state, submittedCvId: action.payload, isSubmitting: false };
    case 'AUTOFILL': {
      const p = action.payload;
      const contact = {
        ...state.contactDetails,
        ...(p.name  ? { fullName: p.name }    : {}),
        ...(p.email ? { email:    p.email }   : {}),
        ...(p.phone ? { phone:    p.phone }   : {}),
        ...(p.address ? { address: p.address } : {}),
      };
      return {
        ...state,
        contactDetails:      contact,
        ...(p.linkedinUrl     ? { linkedinProfile: p.linkedinUrl } : {}),
        ...(p.portfolioUrls?.length ? { portfolioLinks: p.portfolioUrls } : {}),
        ...(p.skills?.length  ? { skills: [...new Set([...state.skills, ...p.skills])] } : {}),
        ...(p.summary         ? { professionalSummary: p.summary } : {}),
      };
    }
    case 'NEW_CV':
      return hydrateBuilderState({});

    case 'RESTORE_DRAFT':
      return hydrateBuilderState(action.payload);

    case 'LOAD_CV': {
      const cv = action.payload;
      return {
        ...initialState,
        draftId: cv.id,
        currentStep: inferResumeStep(cv),
        templateId: cv.templateId,
        templateCustomizations: (cv.templateCustomizations as Record<string, Partial<TemplateOptions>>) || {},
        jobDescription: cv.jobDescription || cv.jobUrl || '',
        toggles: cv.toggles || initialState.toggles,
        contactDetails: { ...initialState.contactDetails, ...cv.contactDetails },
        linkedinProfile: cv.linkedinProfile || '',
        portfolioLinks: cv.portfolioLinks || [],
        professionalSummary: cv.professionalSummary || '',
        skills: cv.skills || [],
        workExperience: cv.workExperience || [],
        education: cv.education || [],
        relevantCourseWork: cv.relevantCourseWork || '',
        certifications: cv.certifications || [],
        references: cv.references || [],
        languages: cv.languages || [],
        awards: cv.awards || [],
        hobbies: cv.hobbies || [],
        // Store the CV id so BuilderPage can upsert it on submit
        submittedCvId: cv.id,
      };
    }

    case 'LOAD_SAMPLE':
      return {
        ...state,
        ...sampleResumeData,
        workExperience: sampleResumeData.workExperience,
        education: sampleResumeData.education,
        certifications: sampleResumeData.certifications ?? [],
        references: sampleResumeData.references ?? [],
        languages: sampleResumeData.languages ?? [],
        awards: sampleResumeData.awards ?? [],
        hobbies: sampleResumeData.hobbies ?? [],
        toggles: {
          languages: true,
          certifications: true,
          awards: true,
          hobbies: true,
          references: true,
        },
      };
    default:
      return state;
  }
}

interface BuilderContextValue {
  state: BuilderState;
  dispatch: React.Dispatch<Action>;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, undefined, getInitialStateWithCache);
  const latest = useRef(state);
  const dispatch = useCallback((action: Action) => {
    const owner = getStoredBuilderUserId();
    const checkpoint = action.type === 'LOAD_CV' && owner
      ? loadBuilderDraft(owner, action.payload.id) : null;
    const resolved: Action = checkpoint ? { type: 'RESTORE_DRAFT', payload: checkpoint } : action;
    const next = reducer(latest.current, resolved);
    latest.current = next;
    // Persist in the event handler, before a route change or browser close can interrupt effects.
    if (hasBuilderProgress(next)) {
      if (owner) saveBuilderDraft(owner, next);
      else if (action.type !== 'NEW_CV') saveAnonymousDraft(next);
    }
    rawDispatch({ type: 'REPLACE_STATE', payload: next });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, [dispatch]);

  const nextStep = useCallback(() => {
    dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
  }, [state.currentStep, dispatch]);

  const prevStep = useCallback(() => {
    dispatch({ type: 'SET_STEP', payload: Math.max(state.currentStep - 1, 1) });
  }, [state.currentStep, dispatch]);

  return (
    <BuilderContext.Provider value={{ state, dispatch, goToStep, nextStep, prevStep }}>
      {children}
    </BuilderContext.Provider>
  );
}

// The provider and hook intentionally share one public builder-state module.
// eslint-disable-next-line react-refresh/only-export-components
export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside BuilderProvider');
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBuilderField<K extends keyof BuilderState>(key: K, fallback?: BuilderState[K]) {
  const { state, dispatch } = useBuilder();
  const value = state[key];
  const current = (Array.isArray(value) && value.length === 0 && fallback ? fallback : value) ?? fallback;
  const setValue = useCallback((next: React.SetStateAction<NonNullable<BuilderState[K]>>) => {
    dispatch({ type: 'UPDATE_FIELD', update: (previous) => {
      if (previous.draftId !== state.draftId) return previous;
      const stored = previous[key];
      const base = (Array.isArray(stored) && stored.length === 0 && fallback ? fallback : stored) ?? fallback;
      return { ...previous, [key]: typeof next === 'function' ? (next as (v: BuilderState[K]) => BuilderState[K])(base as BuilderState[K]) : next };
    } });
  }, [dispatch, key, fallback, state.draftId]);
  return [current as NonNullable<BuilderState[K]>, setValue] as const;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBuilderInput(key: keyof BuilderState['draftInputs']) {
  const [inputs, setInputs] = useBuilderField('draftInputs');
  const setValue = (value: string) => setInputs(previous => ({ ...previous, [key]: value }));
  return [inputs[key], setValue] as const;
}
