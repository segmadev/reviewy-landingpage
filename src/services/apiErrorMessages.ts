export interface ApiErrorLike {
  status: number;
  data: unknown;
  message: string;
}

const DUPLICATE_EMAIL_MESSAGE = 'A user with this email address already exists';
const ERROR_TEXT_FIELDS = ['reason', 'message', 'error', 'detail', 'title'] as const;

function getResponseMessages(data: unknown): string[] {
  if (typeof data === 'string') return [data];
  if (!data || typeof data !== 'object') return [];

  const response = data as Record<string, unknown>;
  return ERROR_TEXT_FIELDS.flatMap(field => {
    const value = response[field];
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
    return [];
  });
}

export function getApiErrorMessage(error: ApiErrorLike, fallback: string): string {
  return getResponseMessages(error.data)[0] || error.message || fallback;
}

/**
 * The signup service currently reports an existing email as a generic
 * "Internal Error". Keep that compatibility rule isolated here so every
 * registration surface presents the same useful message.
 */
export function getSignupErrorMessage(error: ApiErrorLike): string {
  const responseMessages = getResponseMessages(error.data);
  const combined = [...responseMessages, error.message].join(' ').toLowerCase();
  const reportsDuplicate =
    error.status === 409 ||
    /(?:email|user|account).*(?:already exists|already registered|duplicate)|(?:already exists|duplicate).*(?:email|user|account)/i.test(combined);
  const knownGenericConflict =
    error.status === 500 && responseMessages.some(message => /^internal(?: server)? error[.!]?$/i.test(message.trim()));

  if (reportsDuplicate || knownGenericConflict) return DUPLICATE_EMAIL_MESSAGE;
  return getApiErrorMessage(error, 'Signup failed. Please try again.');
}
