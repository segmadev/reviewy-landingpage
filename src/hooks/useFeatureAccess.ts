/**
 * Hook to check feature access and handle insufficient credits
 * Intercepts API errors with code 50 (insufficient credits)
 */

import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isAnonymousSession } from '../services/anonymousSession';

export interface CreditError {
  code: string;
  message: string;
  reason: string;
  field?: string;
  remaining?: number;
  required?: number;
}

/**
 * Hook for handling feature access and credit checks
 * Returns function to wrap API calls that may need credits
 */
export const useFeatureAccess = () => {
  const { isAuthenticated } = useAuth();
  const { error: showError } = useToast();
  const [insufficientCreditsError, setInsufficientCreditsError] = useState<CreditError | null>(null);

  /**
   * Check if user can access a feature
   * - Anonymous users cannot use AI features (except download needs login anyway)
   * - Authenticated users may have insufficient credits
   */
  const checkFeatureAccess = useCallback(async (featureName: string, apiCall: () => Promise<any>) => {
    try {
      // Anonymous users cannot use AI features - must login
      if (isAnonymousSession() && !isAuthenticated) {
        showError(`Please sign in to access ${featureName}. This feature requires an active account.`);
        return null;
      }

      // Execute the API call
      return await apiCall();
    } catch (error: any) {
      // Check if error is insufficient credits (code 50)
      if (error.response?.data?.code === '50') {
        const creditError: CreditError = {
          code: error.response.data.code,
          message: error.response.data.message,
          reason: error.response.data.reason,
        };

        // Parse field and credits from reason string
        // Expected format: "Insufficient AI credits for field 'professionalSummary'. Remaining: 0, Required: 10. Please purchase more credits."
        const fieldMatch = creditError.reason.match(/field '([^']+)'/);
        const remainingMatch = creditError.reason.match(/Remaining: (\d+)/);
        const requiredMatch = creditError.reason.match(/Required: (\d+)/);

        if (fieldMatch) creditError.field = fieldMatch[1];
        if (remainingMatch) creditError.remaining = parseInt(remainingMatch[1]);
        if (requiredMatch) creditError.required = parseInt(requiredMatch[1]);

        setInsufficientCreditsError(creditError);
        showError(creditError.reason);
        return null;
      }

      // Re-throw other errors
      throw error;
    }
  }, [isAuthenticated, showError]);

  /**
   * Clear the insufficient credits error
   */
  const clearError = useCallback(() => {
    setInsufficientCreditsError(null);
  }, []);

  return {
    checkFeatureAccess,
    insufficientCreditsError,
    clearError,
  };
};

/**
 * Hook specifically for checking if user needs to login
 * to access a feature
 */
export const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const { error: showError } = useToast();

  const requireAuth = useCallback((featureName: string) => {
    if (isAnonymousSession() && !isAuthenticated) {
      showError(`Please sign in to use ${featureName}`);
      return false;
    }
    return true;
  }, [isAuthenticated, showError]);

  return { requireAuth };
};
