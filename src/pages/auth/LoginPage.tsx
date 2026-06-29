import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { loginJobSeeker, registerUser, type SignupData } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, fetchProfile } = useAuth();
  const { success, error: showError } = useToast();
  const [isSignup, setIsSignup] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      county: '',
      postcode: '',
      country: 'United Kingdom',
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginJobSeeker(loginForm.email, loginForm.password);
      console.log('✓ Login successful, token:', res.token?.substring(0, 20) + '...');

      login(res.token, res.token, res.user);
      console.log('✓ User state updated');

      // Fetch complete profile after login - pass token directly
      console.log('→ Fetching complete profile...');
      let profileFetchSuccess = false;
      try {
        await fetchProfile(res.token);
        console.log('✓ Profile fetched successfully');
        profileFetchSuccess = true;
      } catch (profileErr) {
        const profileErrMsg = profileErr instanceof Error ? profileErr.message : 'Failed to fetch profile';
        console.error('✗ PROFILE FETCH ERROR:', profileErrMsg);
        console.error('Full error object:', profileErr);
        console.error('Error type:', profileErr instanceof Error ? profileErr.constructor.name : typeof profileErr);

        // Show error to user
        const errorMsg = `Login successful, but profile fetch failed: ${profileErrMsg}. You may still continue.`;
        setError(errorMsg);
        showError(errorMsg);

        // Wait for user to see error before continuing
        console.warn('⚠ Profile fetch failed, waiting 3 seconds before redirect...');
      }

      // Only show success if profile was fetched
      if (profileFetchSuccess) {
        success('Logged in successfully!');
      }

      // Always redirect after login (even if profile fetch fails, user is authenticated)
      setTimeout(() => {
        console.log('→ Redirecting to dashboard...');
        navigate('/dashboard');
      }, profileFetchSuccess ? 500 : 3000);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      console.error('✗ LOGIN ERROR:', message);
      console.error('Full error object:', err);
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (signupForm.password !== signupForm.confirmPassword) {
      const msg = 'Passwords do not match.';
      setError(msg);
      showError(msg);
      return;
    }

    if (!signupForm.address.line1 || !signupForm.address.city || !signupForm.address.postcode) {
      const msg = 'Please fill in all address fields.';
      setError(msg);
      showError(msg);
      return;
    }

    setLoading(true);
    try {
      const signupData: SignupData = {
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        email: signupForm.email,
        password: signupForm.password,
        phoneNumber: signupForm.phoneNumber,
        address: {
          line1: signupForm.address.line1,
          line2: signupForm.address.line2 || '',
          city: signupForm.address.city,
          county: signupForm.address.county || '',
          postcode: signupForm.address.postcode,
          country: signupForm.address.country,
        },
      };

      const res = await registerUser(signupData);
      login(res.token, res.token, res.user);

      // Fetch complete profile after signup - pass token directly
      await fetchProfile(res.token);

      success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/">
            <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-8 sm:h-9 mx-auto mb-4 sm:mb-6" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            {isSignup ? 'Join ReviewyMe to get started' : 'Sign in to manage your CVs'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {isSignup ? (
            // SIGNUP FORM
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="James"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Harrison"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+447911123456"
                  value={signupForm.phoneNumber}
                  onChange={(e) => setSignupForm({ ...signupForm, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  placeholder="42 Kensington High Street"
                  value={signupForm.address.line1}
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      address: { ...signupForm.address, line1: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="London"
                    value={signupForm.address.city}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        address: { ...signupForm.address, city: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                  <input
                    type="text"
                    required
                    placeholder="W8 4PT"
                    value={signupForm.address.postcode}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        address: { ...signupForm.address, postcode: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, password: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, confirmPassword: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full mt-4"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-3">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setError('');
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          ) : (
            // LOGIN FORM
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email / Username
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
                size="lg"
                className="w-full mt-2"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Log In'}
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
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setError('');
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(true);
                    setError('');
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
