/**
 * API Service Layer
 *
 * All functions currently use mock data with simulated latency.
 * To connect a real backend, replace each function body with a fetch/axios call.
 * The function signatures and return types stay the same — no consumer code changes needed.
 *
 * Example swap pattern:
 *   BEFORE: await delay(800); return mockUser
 *   AFTER:  const res = await fetch('/api/auth/login', { method: 'POST', ... }); return res.json()
 */

import type { AuthResponse, ResumeData } from '../types/resume';
import {
  mockUser,
  sampleResumeData,
  aiTailoredBullets,
  aiSkillSuggestions,
} from './mockData';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginJobSeeker(email: string, _password: string): Promise<AuthResponse> {
  await delay(900);
  // TODO: POST /api/auth/login
  if (!email) throw new Error('Email is required');
  return { token: 'mock-jwt-jobseeker', user: mockUser };
}

export async function logoutUser(): Promise<void> {
  await delay(300);
  // TODO: POST /api/auth/logout
}

// ─── CV Builder ──────────────────────────────────────────────────────────────

export async function saveBuilderStep(step: number, data: Partial<ResumeData>): Promise<void> {
  await delay(400);
  // TODO: PUT /api/builder/draft  { step, data }
  console.log('Saving step', step, data);
}

export async function submitCV(data: ResumeData): Promise<{ cvId: string }> {
  await delay(1200);
  // TODO: POST /api/cv/submit
  console.log('Submitting CV', data);
  return { cvId: 'cv-mock-001' };
}

// ─── AI Features ─────────────────────────────────────────────────────────────

export async function getAIBulletPoints(
  jobDescription: string,
  _currentBullets: string[]
): Promise<string[]> {
  await delay(1500);
  // TODO: POST /api/ai/tailor-bullets  { jobDescription, currentBullets }
  console.log('AI tailoring for:', jobDescription.slice(0, 50));
  return aiTailoredBullets.default;
}

export async function getAISkillSuggestions(_jobDescription: string): Promise<string[]> {
  await delay(1000);
  // TODO: POST /api/ai/suggest-skills  { jobDescription }
  return aiSkillSuggestions;
}

export async function generateSummary(data: Partial<ResumeData>): Promise<string> {
  await delay(1800);
  // TODO: POST /api/ai/generate-summary  { resumeData }
  console.log('Generating summary for', data.contactDetails?.fullName);
  return sampleResumeData.professionalSummary;
}


// ─── Settings ────────────────────────────────────────────────────────────────

export async function updateProfile(data: { fullName: string; email: string }): Promise<void> {
  await delay(700);
  // TODO: PUT /api/user/profile
  console.log('Profile updated:', data);
}

export async function changePassword(current: string, next: string): Promise<void> {
  await delay(700);
  // TODO: PUT /api/user/password
  console.log('Password change requested', !!current, !!next);
}

export async function deleteAccount(): Promise<void> {
  await delay(1000);
  // TODO: DELETE /api/user/account
  console.log('Account deletion requested');
}
