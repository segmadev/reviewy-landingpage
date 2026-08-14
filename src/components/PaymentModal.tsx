/**
 * Payment Modal Component
 * Handles the complete payment flow:
 * 1. Show login/signup if not authenticated (embedded forms)
 * 2. Check credit balance
 * 3. Show products if insufficient credits
 * 4. Initiate payment and redirect to payment page only
 * 5. Verify payment on return
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getActiveProducts, loginJobSeeker, registerUser, initiatePayment, verifyPayment, type SignupData } from '../services/api';
import { Button } from './ui/Button';
import type { Product } from '../types/resume';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  aiFeatureName: string;
  requiredCredits?: number;
}

type ModalStep = 'auth' | 'products' | 'payment-processing' | 'payment-success';
type AuthMode = 'login' | 'signup';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess: _onPaymentSuccess,
  aiFeatureName,
  requiredCredits = 10,
}) => {
  const { isAuthenticated, user, login, fetchProfile } = useAuth();
  const { error: showError, success: showSuccess } = useToast();

  const [step, setStep] = useState<ModalStep>(isAuthenticated ? 'products' : 'auth');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Auth form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Load products when modal opens and user is authenticated
  useEffect(() => {
    if (!isOpen) return;

    // Check if there's a pending payment to verify
    const pendingTransactionId = sessionStorage.getItem('paymentTransactionId');
    if (pendingTransactionId && isAuthenticated) {
      // Try to verify the payment
      (async () => {
        try {
          const verification = await verifyPayment(pendingTransactionId);
          const status = (verification as any).paymentStatus || verification.status;

          if (status === 'SUCCESS' || status === 'success') {
            setStep('payment-success');
            sessionStorage.removeItem('paymentTransactionId');
            sessionStorage.removeItem('paymentTimestamp');

            // Auto-retry the AI request after a short delay
            setTimeout(() => {
              _onPaymentSuccess();
              onClose();
            }, 2000);
            return;
          }
        } catch (error) {
          console.log('Payment verification check:', error);
        }
      })();
    }

    if (!isAuthenticated) {
      setStep('auth');
      setAuthMode('login');
      return;
    }

    // User is authenticated, fetch products and credits
    const loadData = async () => {
      setLoading(true);
      try {
        const prods = await getActiveProducts();
        setProducts(prods);
        setStep('products');
      } catch (error) {
        console.error('Failed to load products:', error);
        showError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, isAuthenticated, showError, _onPaymentSuccess, onClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const res = await loginJobSeeker(loginForm.email, loginForm.password);
      login(res.token, res.token, res.user);

      try {
        await fetchProfile(res.token);
      } catch (profileErr) {
        console.error('Profile fetch error:', profileErr);
      }

      showSuccess('Logged in successfully!');

      // Load products after login
      const prods = await getActiveProducts();
      setProducts(prods);
      setStep('products');
      setLoginForm({ email: '', password: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setAuthError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (signupForm.password !== signupForm.confirmPassword) {
      const msg = 'Passwords do not match.';
      setAuthError(msg);
      showError(msg);
      return;
    }

    setLoading(true);
    try {
      const signupData: SignupData = {
        email: signupForm.email,
        password: signupForm.password,
      };

      const res = await registerUser(signupData);
      login(res.accessToken, res.refreshToken, undefined);

      try {
        await fetchProfile(res.accessToken);
      } catch (profileErr) {
        console.error('Profile fetch error:', profileErr);
      }

      showSuccess('Account created successfully!');

      // Load products after signup
      const prods = await getActiveProducts();
      setProducts(prods);
      setStep('products');
      setSignupForm({ email: '', password: '', confirmPassword: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setAuthError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    if (!user?.id) {
      showError('User ID not found. Please try again.');
      return;
    }

    if (!product.id) {
      showError('Product ID not found. Please try again.');
      console.error('Product object:', product);
      return;
    }

    setSelectedProduct(product);
    setStep('payment-processing');

    try {
      // Initiate payment using API service
      console.log('Initiating payment:', { userId: user.id, productId: product.id, quantity: 1 });
      const response = await initiatePayment(user.id, product.id, 1);

      // Store transaction ID in session for verification
      if (response.transactionId) {
        sessionStorage.setItem('paymentTransactionId', response.transactionId);
        sessionStorage.setItem('paymentTimestamp', Date.now().toString());
      }

      // Open payment link in new tab instead of redirecting
      if (response.paymentLink) {
        window.open(response.paymentLink, '_blank');

        // Start polling for payment verification after user closes payment tab
        const pollPaymentStatus = setInterval(async () => {
          try {
            // Check if payment was verified
            const verification = await verifyPayment(response.transactionId);
            const status = (verification as any).paymentStatus || verification.status;

            if (status === 'SUCCESS' || status === 'success') {
              clearInterval(pollPaymentStatus);
              setStep('payment-success');

              // Auto-retry the AI request after a short delay
              setTimeout(() => {
                _onPaymentSuccess();
                onClose();
              }, 2000);
            }
          } catch (error) {
            console.log('Payment verification pending...');
          }
        }, 2000); // Check every 2 seconds

        // Stop polling after 15 minutes
        setTimeout(() => clearInterval(pollPaymentStatus), 15 * 60 * 1000);
      } else {
        showError('Payment link not provided by server.');
        setStep('products');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      showError('Failed to initiate payment. Please try again.');
      setStep('products');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {step === 'auth' && (authMode === 'login' ? 'Sign In to Continue' : 'Create Account')}
              {step === 'products' && 'Get AI Credits'}
              {step === 'payment-processing' && 'Processing Payment'}
              {step === 'payment-success' && 'Payment Successful'}
            </h2>
            {step !== 'payment-processing' && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {step === 'auth' && (
              <div>
                <p className="text-gray-600 text-sm mb-6">
                  Sign in to access AI features and use <strong>{aiFeatureName}</strong>.
                </p>

                {authError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                    {authError}
                  </div>
                )}

                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="w-full mt-2"
                    >
                      {loading ? 'Signing in…' : 'Log In'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-xs"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="w-full mt-2"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                )}

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
                    or
                  </div>
                </div>

                <p className="text-center text-xs text-gray-600">
                  {authMode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setAuthError('');
                          setLoginForm({ email: '', password: '' });
                        }}
                        className="text-primary font-medium hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setAuthError('');
                          setSignupForm({ email: '', password: '', confirmPassword: '' });
                        }}
                        className="text-primary font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            )}

            {step === 'products' && (
              <div>
                <p className="text-gray-600 text-sm mb-6">
                  You need <strong>{requiredCredits} credits</strong> to use{' '}
                  <strong>{aiFeatureName}</strong>. Select a package:
                </p>

                <div className="space-y-3">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <motion.button
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSelectProduct(product)}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          <span className="text-xl font-bold text-primary">
                            £{product.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {product.description}
                        </p>
                        {product.features && (
                          <ul className="mt-3 text-xs text-gray-500 space-y-1">
                            {product.features.slice(0, 2).map((feat: string, i: number) => (
                              <li key={i}>✓ {feat}</li>
                            ))}
                          </ul>
                        )}
                      </motion.button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No products available
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 'payment-processing' && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-gray-600 text-center">
                  Processing your payment for <strong>{selectedProduct?.name}</strong>...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  You'll be redirected to complete the payment.
                </p>
              </div>
            )}

            {step === 'payment-success' && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your credits have been added. Retrying{' '}
                  <strong>{aiFeatureName}</strong>...
                </p>
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
