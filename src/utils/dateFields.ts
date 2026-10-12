export const PRESENT_DATE = 'Present';

/** Returns the API-compatible date used when an end date is marked as ongoing. */
export function currentMonthDate(): string {
  return `${new Date().toISOString().slice(0, 7)}-01`;
}

/** Converts an HTML month value into the API's date format without creating a fake date when cleared. */
export function monthInputToDate(month: string): string {
  return month ? `${month}-01` : '';
}

/** Identifies the explicit ongoing-role value used by Work History end dates. */
export function isPresentDate(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === PRESENT_DATE.toLowerCase();
}

/** Treats the current month as the persisted representation of an ongoing end date. */
export function isOngoingEndDate(value: string | undefined): boolean {
  const normalized = value?.trim();
  return isPresentDate(normalized) || Boolean(normalized && normalized.slice(0, 7) === currentMonthDate().slice(0, 7));
}

/** Migrates the legacy Present sentinel to the API's required ISO date shape. */
export function dateForApi(value: string): string {
  return isPresentDate(value) ? currentMonthDate() : value;
}

/** Treats empty values and the legacy clear-field sentinel as incomplete. */
export function isDateFieldComplete(value: string | undefined): boolean {
  const normalized = value?.trim();
  return Boolean(normalized && normalized !== '-01');
}
