/**
 * Manages anonymous user sessions stored in localStorage
 * Draft CVs are stored locally and expire after 78 hours
 */

const SESSION_PREFIX = 'anon_session_';
const DRAFT_PREFIX = 'anon_draft_';
const SESSION_EXPIRY = 78 * 60 * 60 * 1000; // 78 hours in milliseconds

export interface AnonymousSession {
  id: string;
  createdAt: number;
  expiresAt: number;
  lastModified: number;
}

/** Generate a unique session ID for anonymous users */
export const generateSessionId = (): string => {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/** Get or create anonymous session */
export const getOrCreateSession = (): AnonymousSession => {
  const sessionKey = SESSION_PREFIX + 'current';
  const stored = localStorage.getItem(sessionKey);

  if (stored) {
    const session: AnonymousSession = JSON.parse(stored);
    // Check if session is still valid
    if (session.expiresAt > Date.now()) {
      return session;
    }
    // Session expired, clean up
    clearSession();
  }

  // Create new session
  const now = Date.now();
  const session: AnonymousSession = {
    id: generateSessionId(),
    createdAt: now,
    expiresAt: now + SESSION_EXPIRY,
    lastModified: now,
  };

  localStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
};

/** Get current session if it exists and is valid */
export const getCurrentSession = (): AnonymousSession | null => {
  const sessionKey = SESSION_PREFIX + 'current';
  const stored = localStorage.getItem(sessionKey);

  if (!stored) return null;

  const session: AnonymousSession = JSON.parse(stored);
  if (session.expiresAt > Date.now()) {
    return session;
  }

  // Session expired
  clearSession();
  return null;
};

/** Save anonymous draft CV */
export const saveAnonymousDraft = (draftData: any, draftId: string = 'default'): void => {
  const session = getOrCreateSession();
  const draftKey = DRAFT_PREFIX + session.id + '_' + draftId;

  const draft = {
    data: draftData,
    savedAt: Date.now(),
    sessionId: session.id,
    expiresAt: session.expiresAt,
  };

  localStorage.setItem(draftKey, JSON.stringify(draft));

  // Update session last modified
  session.lastModified = Date.now();
  localStorage.setItem(SESSION_PREFIX + 'current', JSON.stringify(session));
};

/** Get anonymous draft CV */
export const getAnonymousDraft = (draftId: string = 'default'): any | null => {
  const session = getCurrentSession();
  if (!session) return null;

  const draftKey = DRAFT_PREFIX + session.id + '_' + draftId;
  const stored = localStorage.getItem(draftKey);

  if (!stored) return null;

  const draft = JSON.parse(stored);

  // Check if draft is still valid (within session expiry)
  if (draft.expiresAt > Date.now()) {
    return draft.data;
  }

  // Draft expired, clean up
  localStorage.removeItem(draftKey);
  return null;
};

/** List all anonymous drafts for current session */
export const listAnonymousDrafts = (): string[] => {
  const session = getCurrentSession();
  if (!session) return [];

  const drafts: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(DRAFT_PREFIX + session.id)) {
      const draftId = key.substring((DRAFT_PREFIX + session.id + '_').length);
      drafts.push(draftId);
    }
  }

  return drafts;
};

/** Delete a specific anonymous draft */
export const deleteAnonymousDraft = (draftId: string = 'default'): void => {
  const session = getCurrentSession();
  if (!session) return;

  const draftKey = DRAFT_PREFIX + session.id + '_' + draftId;
  localStorage.removeItem(draftKey);
};

/** Clear entire session and all associated drafts */
export const clearSession = (): void => {
  const session = getCurrentSession();
  if (!session) return;

  // Remove all drafts for this session
  const draftPrefix = DRAFT_PREFIX + session.id;
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith(draftPrefix)) {
      localStorage.removeItem(key);
    }
  }

  // Remove session
  localStorage.removeItem(SESSION_PREFIX + 'current');
};

/** Check if user is in anonymous session */
export const isAnonymousSession = (): boolean => {
  return getCurrentSession() !== null;
};

/** Get session expiry time remaining in hours */
export const getSessionTimeRemaining = (): number => {
  const session = getCurrentSession();
  if (!session) return 0;

  const remaining = session.expiresAt - Date.now();
  return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60))); // Convert to hours
};
