import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  initiatePayment,
  verifyPayment,
  getPaymentHistory,
  type PaymentResponse,
} from '../services/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  pricing: Array<{
    amount: number;
    currency: string;
    type: 'ONE_OFF' | 'RECURRING';
    billingCycle?: string;
    trialAmount?: number;
    trialPeriod?: string;
  }>;
  category: string;
  features: string[];
  active: boolean;
}

export function usePayments() {
  const { user } = useAuth();
  const { success, error: showError, loading: showLoading, removeToast } = useToast();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    setIsLoading(true);
    getPaymentHistory(user.id)
      .then(setPayments)
      .catch((error) => {
        console.error('Failed to load payment history:', error);
        showError('Failed to load payment history');
      })
      .finally(() => setIsLoading(false));
  }, [user?.id, showError]);

  const initiatePaymentFlow = async (productId: string, quantity: number = 1) => {
    if (!user?.id) {
      showError('Please sign in first');
      return null;
    }

    try {
      const toastId = showLoading('Processing payment...');
      const response = await initiatePayment(user.id, productId, quantity);
      removeToast(toastId);
      success('Payment processed successfully');
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment failed';
      showError(message);
      return null;
    }
  };

  const checkPaymentStatus = async (transactionId: string) => {
    try {
      const response = await verifyPayment(transactionId);
      return response;
    } catch (error) {
      console.error('Failed to verify payment:', error);
      return null;
    }
  };

  return {
    payments,
    loading: isLoading,
    initiatePayment: initiatePaymentFlow,
    verifyPayment: checkPaymentStatus,
  };
}
