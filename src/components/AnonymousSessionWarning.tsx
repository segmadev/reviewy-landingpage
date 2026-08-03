/**
 * Warning banner shown to anonymous users
 * - Displays remaining session time (78 hours)
 * - Prompts to sign up to save permanently
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSessionTimeRemaining, isAnonymousSession } from '../services/anonymousSession';

export const AnonymousSessionWarning: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only show if user is anonymous
    if (isAuthenticated || !isAnonymousSession()) {
      setTimeRemaining(0);
      return;
    }

    // Update time remaining every minute
    const updateTime = () => {
      const hours = getSessionTimeRemaining();
      setTimeRemaining(hours);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!timeRemaining || dismissed || isAuthenticated) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-24 left-4 right-4 z-40 max-w-md mx-auto"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-amber-900 text-sm">
                Temporary Session Active
              </h3>
              <p className="text-amber-800 text-xs mt-1">
                Your CV draft will be saved locally for <strong>{timeRemaining} hours</strong>.
                Sign up to save permanently and access all features.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate('/auth/login?mode=signup')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign Up Now
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-amber-700 hover:text-amber-900 font-medium text-xs"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-400 hover:text-amber-600 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnonymousSessionWarning;
