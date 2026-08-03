/**
 * Payment Gate Hook
 * Handles credit checking and payment modal flow for AI features
 * Integrates with backend payment endpoints
 */

import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserCreditBalance } from '../services/api';

interface CreditCheckResult {
  hasCredits: boolean;
  balance: number;
  required: number;
}

interface PaymentGateState {
  showPaymentModal: boolean;
  aiFeatureName: string;
  requiredCredits: number;
  userBalance: number;
  isPendingRetry: boolean;
}

/**
 * Hook to manage payment gating for AI features
 * Checks credits and handles payment flow
 */
export const usePaymentGate = () => {
  const { isAuthenticated, user } = useAuth();
  const { error: showError } = useToast();

  const [state, setState] = useState<PaymentGateState>({
    showPaymentModal: false,
    aiFeatureName: '',
    requiredCredits: 10,
    userBalance: 0,
    isPendingRetry: false,
  });

  const [pendingRequest, setPendingRequest] = useState<{
    apiCall: () => Promise<any>;
    onSuccess: (result: any) => void;
  } | null>(null);

  /**
   * Check if user has sufficient credits
   * Returns credit balance info
   */
  const checkCredits = useCallback(
    async (requiredCredits: number = 10): Promise<CreditCheckResult> => {
      if (!isAuthenticated || !user?.id) {
        return { hasCredits: false, balance: 0, required: requiredCredits };
      }

      try {
        // Fetch user credit balance from backend using API service
        const creditBalance = await getUserCreditBalance(user.id);
        const balance = creditBalance.totalCreditsRemaining || 0;

        return {
          hasCredits: balance >= requiredCredits,
          balance,
          required: requiredCredits,
        };
      } catch (error) {
        console.error('Credit check failed:', error);
        showError('Failed to check credits. Please try again.');
        return { hasCredits: false, balance: 0, required: requiredCredits };
      }
    },
    [isAuthenticated, user?.id, showError]
  );

  /**
   * Gate an AI feature with credit checking and payment flow
   * If user lacks credits, shows payment modal and retries after payment
   */
  const gateAIFeature = useCallback(
    async (
      featureName: string,
      apiCall: () => Promise<any>,
      requiredCredits: number = 10,
      onSuccess?: (result: any) => void
    ) => {
      // Step 1: Check if user is authenticated
      if (!isAuthenticated) {
        // Show payment modal with login step
        setState((prev) => ({
          ...prev,
          showPaymentModal: true,
          aiFeatureName: featureName,
          requiredCredits,
        }));

        // Store pending request for retry after payment
        setPendingRequest({
          apiCall,
          onSuccess: onSuccess || (() => {}),
        });

        return null;
      }

      // Step 2: Check credit balance
      const creditCheck = await checkCredits(requiredCredits);

      if (!creditCheck.hasCredits) {
        // User needs to buy credits
        setState((prev) => ({
          ...prev,
          showPaymentModal: true,
          aiFeatureName: featureName,
          requiredCredits,
          userBalance: creditCheck.balance,
        }));

        // Store pending request for retry after payment
        setPendingRequest({
          apiCall,
          onSuccess: onSuccess || (() => {}),
        });

        return null;
      }

      // Step 3: User has credits, execute the API call
      try {
        const result = await apiCall();
        onSuccess?.(result);
        return result;
      } catch (error: any) {
        // Check if error is insufficient credits (code 50)
        if (error.response?.data?.code === '50') {
          const creditError = error.response.data;
          setState((prev) => ({
            ...prev,
            showPaymentModal: true,
            aiFeatureName: featureName,
            requiredCredits: requiredCredits || 10,
          }));

          setPendingRequest({
            apiCall,
            onSuccess: onSuccess || (() => {}),
          });

          showError(creditError.reason);
          return null;
        }

        throw error;
      }
    },
    [isAuthenticated, checkCredits, showError]
  );

  /**
   * Called after successful payment
   * Retries the pending AI request
   */
  const retryAfterPayment = useCallback(async () => {
    if (!pendingRequest) return;

    setState((prev) => ({
      ...prev,
      showPaymentModal: false,
      isPendingRetry: true,
    }));

    try {
      const result = await pendingRequest.apiCall();
      pendingRequest.onSuccess(result);
      setPendingRequest(null);
    } catch (error) {
      console.error('Retry after payment failed:', error);
      showError('Failed to retry the request. Please try again.');
      setState((prev) => ({
        ...prev,
        isPendingRetry: false,
      }));
    }
  }, [pendingRequest, showError]);

  /**
   * Close payment modal without proceeding
   */
  const closePaymentModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showPaymentModal: false,
    }));
    // Don't clear pending request - allow user to retry
  }, []);

  return {
    // State
    showPaymentModal: state.showPaymentModal,
    aiFeatureName: state.aiFeatureName,
    requiredCredits: state.requiredCredits,
    userBalance: state.userBalance,
    isPendingRetry: state.isPendingRetry,

    // Functions
    gateAIFeature,
    checkCredits,
    retryAfterPayment,
    closePaymentModal,
  };
};

export default usePaymentGate;
