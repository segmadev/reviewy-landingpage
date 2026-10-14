import type { WorkExperience } from '../types/resume';
import { isPresentDate, PRESENT_DATE } from '../utils/dateFields';

function hasEnteredWorkExperience(entry: WorkExperience): boolean {
  return Boolean(
    entry.position.trim() ||
    entry.company.trim() ||
    entry.startDate.trim() ||
    entry.endDate.trim() ||
    entry.responsibilities.some(item => item.trim())
  );
}

function dateOrPresent(value: string, ongoing = false): string {
  return !value.trim() || (ongoing && isPresentDate(value)) ? PRESENT_DATE : value.trim();
}

/** Serializes every populated Work History entry for the AI suggestions API. */
export function serializeWorkExperienceForAI(entries: WorkExperience[]): string {
  return JSON.stringify(
    entries.filter(hasEnteredWorkExperience).map(entry => ({
      position: entry.position,
      company: entry.company,
      startDate: dateOrPresent(entry.startDate),
      endDate: dateOrPresent(entry.endDate, true),
      responsibilities: entry.responsibilities.filter(item => item.trim()),
    }))
  );
}
