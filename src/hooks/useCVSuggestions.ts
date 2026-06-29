import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserResumes } from '../services/api';
import type { SavedCV, WorkExperience, Education, Certification } from '../types/resume';

export interface CVSuggestions {
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: string[];
  certifications: Certification[];
  languages: string[];
}

export function useCVSuggestions() {
  const { isAuthenticated } = useAuth();
  const { error: showError } = useToast();
  const [suggestions, setSuggestions] = useState<CVSuggestions>({
    workExperiences: [],
    educations: [],
    skills: [],
    certifications: [],
    languages: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    getUserResumes()
      .then((cvs) => {
        const allExperiences: WorkExperience[] = [];
        const allEducations: Education[] = [];
        const allSkills: string[] = [];
        const allCertifications: Certification[] = [];
        const allLanguages: string[] = [];

        cvs.forEach((cv: SavedCV) => {
          allExperiences.push(...(cv.workExperience || []));
          allEducations.push(...(cv.education || []));
          allSkills.push(...(cv.skills || []));
          allCertifications.push(...(cv.certifications || []));
          allLanguages.push(...(cv.languages || []));
        });

        // Remove duplicates
        const uniqueSkills = Array.from(new Set(allSkills));
        const uniqueLanguages = Array.from(new Set(allLanguages));

        setSuggestions({
          workExperiences: allExperiences,
          educations: allEducations,
          skills: uniqueSkills,
          certifications: allCertifications,
          languages: uniqueLanguages,
        });
      })
      .catch((error) => {
        console.error('Failed to load CV suggestions:', error);
        // Don't show error toast - this is optional feature
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, showError]);

  return { suggestions, loading };
}
