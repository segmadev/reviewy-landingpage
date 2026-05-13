import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { ResumeData, WorkExperience, Education, Certification, Reference, SavedCV } from '../types/resume';
import type { TemplateOptions } from '../components/templates/utils';
import type { ExtractionResult } from '../services/extractCvData';
import { sampleResumeData } from '../services/mockData';

export interface BuilderState extends ResumeData {
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
  contactDetails: { fullName: '', address: '', phone: '', email: '' },
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

type Action =
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
  | { type: 'NEW_CV' };

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
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
      return { ...initialState, currentStep: 1 };

    case 'LOAD_CV': {
      const cv = action.payload;
      return {
        ...initialState,
        currentStep: 1,
        templateId: cv.templateId,
        templateCustomizations: cv.templateCustomizations as Record<string, Partial<TemplateOptions>>,
        jobDescription: cv.jobDescription,
        toggles: cv.toggles,
        contactDetails: cv.contactDetails,
        linkedinProfile: cv.linkedinProfile,
        portfolioLinks: cv.portfolioLinks,
        professionalSummary: cv.professionalSummary,
        skills: cv.skills,
        workExperience: cv.workExperience,
        education: cv.education,
        relevantCourseWork: cv.relevantCourseWork,
        certifications: cv.certifications,
        references: cv.references,
        languages: cv.languages,
        awards: cv.awards,
        hobbies: cv.hobbies,
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
  const [state, dispatch] = useReducer(reducer, initialState);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    dispatch({ type: 'SET_STEP', payload: Math.max(state.currentStep - 1, 1) });
  }, [state.currentStep]);

  return (
    <BuilderContext.Provider value={{ state, dispatch, goToStep, nextStep, prevStep }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside BuilderProvider');
  return ctx;
}
