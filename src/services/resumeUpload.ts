import type { SavedCV } from '../types/resume';

export const RESUME_FILE_ACCEPT = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const SUPPORTED_EXTENSIONS = new Set(['pdf', 'docx']);

export function validateResumeFile(file: Pick<File, 'name'>): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension && SUPPORTED_EXTENSIONS.has(extension)
    ? null
    : 'Please choose a PDF or DOCX file.';
}

function unwrapResume(response: unknown): Partial<SavedCV> {
  if (!response || typeof response !== 'object') return {};
  const envelope = response as Record<string, unknown>;
  const nested = envelope.resume ?? envelope.data;
  return (nested && typeof nested === 'object' ? nested : envelope) as Partial<SavedCV>;
}

/** Normalizes the API response so the existing builder can load it safely. */
export function normalizeUploadedResume(response: unknown, sourceFileName: string): SavedCV {
  const resume = unwrapResume(response);
  if (!resume.id || typeof resume.id !== 'string') {
    throw new Error('The uploaded resume was created without an ID. Please try again.');
  }

  const now = new Date().toISOString();
  const fallbackName = sourceFileName.replace(/\.(pdf|docx)$/i, '').trim() || 'Uploaded CV';
  const languages = Array.isArray(resume.languages) ? resume.languages : [];
  const certifications = Array.isArray(resume.certifications) ? resume.certifications : [];
  const awards = Array.isArray(resume.awards) ? resume.awards : [];
  const hobbies = Array.isArray(resume.hobbies) ? resume.hobbies : [];
  const references = Array.isArray(resume.references) ? resume.references : [];

  return {
    id: resume.id,
    name: resume.name || fallbackName,
    templateId: resume.templateId || 'classic',
    templateCustomizations: resume.templateCustomizations || {},
    contactDetails: {
      fullName: '', address: '', city: '', postcode: '', phone: '', email: '', country: 'GB',
      ...resume.contactDetails,
    },
    linkedinProfile: resume.linkedinProfile || '',
    portfolioLinks: Array.isArray(resume.portfolioLinks) ? resume.portfolioLinks : [],
    professionalSummary: resume.professionalSummary || '',
    skills: Array.isArray(resume.skills) ? resume.skills : [],
    workExperience: Array.isArray(resume.workExperience) ? resume.workExperience : [],
    education: Array.isArray(resume.education) ? resume.education : [],
    relevantCourseWork: resume.relevantCourseWork || '',
    certifications,
    references,
    languages,
    awards,
    hobbies,
    jobDescription: resume.jobDescription || '',
    jobUrl: resume.jobUrl,
    toggles: resume.toggles || {
      languages: languages.length > 0,
      certifications: certifications.length > 0,
      awards: awards.length > 0,
      hobbies: hobbies.length > 0,
      references: references.length > 0,
    },
    createdAt: resume.createdAt || now,
    updatedAt: resume.updatedAt || now,
    isDraft: true,
    currentStep: resume.currentStep,
  };
}
