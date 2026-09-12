const USER_LOCAL_STORAGE_PREFIX = 'rym_';

const USER_SESSION_STORAGE_KEYS = [
  'paymentTransactionId',
  'paymentTimestamp',
] as const;

/**
 * Removes data that belongs to the signed-in account while preserving
 * visitor-level choices such as cookie consent and anonymous draft storage.
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
