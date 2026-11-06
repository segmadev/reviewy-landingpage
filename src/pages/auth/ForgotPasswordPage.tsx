import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { initiatePasswordReset } from '../../services/api';

const RESET_LINK_CONFIRMATION =
  'A password reset link has been sent to your email address. Please check your inbox and spam folder. If it does not arrive, wait a few minutes and try again.';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await initiatePasswordReset(normalizedEmail);
      setSubmittedEmail(normalizedEmail);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'We could not request a password reset right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setSubmittedEmail('');
    setError('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 text-center sm:mb-8">
          <Link to="/">
            <img
              src="/asstes/onwhite-logo.png"
              alt="ReviewyMe"
              className="mx-auto mb-4 h-8 sm:mb-6 sm:h-9"
            />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {submittedEmail ? 'Check your email' : 'Forgot your password?'}
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            {submittedEmail
              ? 'Follow the link in the email to create a new password.'
              : 'Enter your email and we’ll send you a password reset link.'}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          {submittedEmail ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-gray-600">{RESET_LINK_CONFIRMATION}</p>
              <p className="mt-2 break-all text-sm font-medium text-gray-900">{submittedEmail}</p>

              <Link
                to="/auth/login"
                className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to sign in
              </Link>

              <button
                type="button"
                onClick={resetForm}
                className="mt-4 block w-full text-xs font-medium text-gray-500 hover:text-primary"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password-reset-email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="password-reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError('');
                    }}
                    className="w-full rounded-lg border border-transparent bg-gray-50 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                {loading ? 'Sending reset link…' : 'Send reset link'}
              </Button>

              <Link
                to="/auth/login"
                className="flex items-center justify-center gap-2 pt-1 text-sm font-medium text-gray-600 hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to sign in
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
