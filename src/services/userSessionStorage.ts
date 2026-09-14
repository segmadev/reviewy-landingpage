const USER_LOCAL_STORAGE_PREFIX = 'rym_';

const USER_SESSION_STORAGE_KEYS = [
  'paymentTransactionId',
  'paymentTimestamp',
] as const;

/**
 * Removes authentication/session data that belongs to the signed-in account.
 * Completed and in-progress CV documents use separate owner-scoped persistence,
 * so they remain recoverable only after the same account signs in again.
 */
export function clearSignedInUserStorage(): void {
  try {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(USER_LOCAL_STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Failed to clear signed-in user local storage:', error);
  }

  try {
    USER_SESSION_STORAGE_KEYS.forEach((key) => sessionStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear signed-in user session storage:', error);
  }
}
