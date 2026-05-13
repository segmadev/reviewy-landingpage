export interface ContactDetails {
  fullName: string;
  address: string;
  phone: string;
  email: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  contact: string;
}

export interface ResumeData {
  contactDetails: ContactDetails;
  linkedinProfile: string;
  portfolioLinks: string[];
  professionalSummary: string;
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
  relevantCourseWork: string;
  certifications: Certification[];
  references: Reference[];
  // Optional sections (toggled in Step 7)
  languages?: string[];
  awards?: string[];
  hobbies?: string[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'jobseeker' | 'recruiter';
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardMetrics {
  cvViews: number;
  unlocks: number;
  rank: number;
  viewsThisWeek: number[];
  pipelineBreakdown: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: {
    monthly: number;
    annual: number;
    credits: number;
  };
  features: string[];
  featured?: boolean;
}

/** A CV saved to the user's library (persisted in localStorage). */
export interface SavedCV {
  id: string;
  name: string;               // user-editable label, e.g. "Software Engineer CV"
  templateId: string;
  templateCustomizations: Record<string, Record<string, unknown>>;
  // ── Resume content ──
  contactDetails: ContactDetails;
  linkedinProfile: string;
  portfolioLinks: string[];
  professionalSummary: string;
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
  relevantCourseWork: string;
  certifications: Certification[];
  references: Reference[];
  languages: string[];
  awards: string[];
  hobbies: string[];
  jobDescription: string;
  toggles: {
    languages: boolean;
    certifications: boolean;
    awards: boolean;
    hobbies: boolean;
    references: boolean;
  };
  // ── Meta ──
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
}
