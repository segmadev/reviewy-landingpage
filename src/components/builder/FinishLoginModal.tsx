import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { loginJobSeeker, registerUser, type SignupData } from '../../services/api';
import { Button } from '../ui/Button';

interface FinishLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'signup';

export default function FinishLoginModal({ isOpen, onClose, onLoginSuccess }: FinishLoginModalProps) {
  const { login, fetchProfile } = useAuth();
  const { error: showError, success: showSuccess } = useToast();

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '' });

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
      setLoginForm({ email: '', password: '' });

      // Call onLoginSuccess after a brief delay to show the success message
      setTimeout(() => {
        onLoginSuccess();
        onClose();
      }, 500);
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
      setSignupForm({ email: '', password: '' });

      setTimeout(() => {
        onLoginSuccess();
        onClose();
      }, 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setAuthError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {authError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                    {authError}
                  </div>
                )}

                {authMode === 'login' ? (
                  // LOGIN FORM
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
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
                          className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
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

                    <Button type="submit" disabled={loading} size="lg" className="w-full mt-6">
                      {loading ? 'Signing in…' : 'Sign In'}
                    </Button>
                  </form>
                ) : (
                  // SIGNUP FORM
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
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
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
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

                    <Button type="submit" disabled={loading} size="lg" className="w-full mt-6">
                      {loading ? 'Creating Account…' : 'Create Account'}
                    </Button>
                  </form>
                )}

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
                    or
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600">
                  {authMode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setAuthError('');
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
                        }}
                        className="text-primary font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
