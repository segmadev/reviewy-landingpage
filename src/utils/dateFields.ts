/** Converts an HTML month value into the API's date format without creating a fake date when cleared. */
export function monthInputToDate(month: string): string {
  return month ? `${month}-01` : '';
}

/** Treats empty values and the legacy clear-field sentinel as incomplete. */
export function isDateFieldComplete(value: string | undefined): boolean {
  const normalized = value?.trim();
  return Boolean(normalized && normalized !== '-01');
}
