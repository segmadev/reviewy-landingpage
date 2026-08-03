import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useBuilder } from '../../../context/BuilderContext';
import { useToast } from '../../../context/ToastContext';
import { generateSummary } from '../../../services/api';
import { usePaymentGate } from '../../../hooks/usePaymentGate';
import PaymentModal from '../../PaymentModal';

export default function Step6Summary() {
  const { state, dispatch, nextStep, prevStep } = useBuilder();
  const { error: showError } = useToast();
  const paymentGate = usePaymentGate();
  const [summary, setSummary] = useState(state.professionalSummary);
  const [generating, setGenerating] = useState(false);
  const [reasoning, setReasoning] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const abortControllerRef = useRef<AbortController | null>(null);
  const autoGeneratingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Detect all placeholder patterns: [X], [Company Name], [Number], etc.
  const placeholderPattern = /\[([^\]]+)\]/g;
  const hasPlaceholders = placeholderPattern.test(summary);
  const placeholderMatches = summary.match(/\[([^\]]+)\]/g) || [];
  const placeholderCount = placeholderMatches.length;
  const uniquePlaceholders = Array.from(new Set(placeholderMatches));

  // Scroll to and highlight placeholder in textarea
  const scrollToPlaceholder = (placeholder: string) => {
    if (!textareaRef.current) return;

    // Escape special regex characters in placeholder
    const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedPlaceholder, 'i');
    const index = summary.search(regex);

    if (index !== -1) {
      const textarea = textareaRef.current;

      // Focus textarea first
      textarea.focus();

      // Set selection to the placeholder
      textarea.setSelectionRange(index, index + placeholder.length);

      // Get line number by counting newlines before the placeholder
      const beforeText = summary.substring(0, index);
      const lineNumber = beforeText.split('\n').length - 1;

      // Get computed line height
      const styles = window.getComputedStyle(textarea);
      const lineHeight = parseFloat(styles.lineHeight) || 20;

      // Calculate scroll position: scroll to show the line roughly in the middle
      const scrollTop = Math.max(0, lineNumber * lineHeight - lineHeight * 2);

      // Set scroll position
      textarea.scrollTop = scrollTop;

      // Trigger a scroll event to ensure it takes effect
      textarea.dispatchEvent(new Event('scroll', { bubbles: true }));
    }
  };

  const handleGenerate = async () => {
    if (!state.jobDescription) {
      showError('Please fill in the job description in Step 1 first');
      return;
    }

    // Generate initial content from work experience and skills if summary is empty
    let contentToSend = summary;
    if (!contentToSend || contentToSend.trim().length === 0) {
      const firstJob = state.workExperience?.[0];
      const skills = state.skills?.slice(0, 5).join(', ') || '';

      if (firstJob) {
        contentToSend = `${firstJob.position}${skills ? ` with expertise in ${skills}` : ''}`;
      } else if (skills) {
        contentToSend = `Professional with expertise in ${skills}`;
      } else {
        contentToSend = 'Professional with relevant expertise';
      }
    }

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();
    setGenerating(true);

    await paymentGate.gateAIFeature(
      'Professional Summary',
      async () => {
        return await generateSummary(state.jobDescription, contentToSend, conversationId);
      },
      10,
      (response) => {
        setSummary(response.items[0] || '');
        setReasoning(response.reasoning);
        setConversationId(response.conversationId);
      }
    );

    setGenerating(false);
  };

  const handleCancelGeneration = () => {
    abortControllerRef.current?.abort();
    setGenerating(false);
  };

  // Auto-generate summary if empty on mount
  useEffect(() => {
    if (summary.trim() === '' && !autoGeneratingRef.current && state.jobDescription) {
      autoGeneratingRef.current = true;
      handleGenerate();
    }
  }, []);

  const handleNext = () => {
    dispatch({ type: 'SET_SUMMARY', payload: summary });
    nextStep();
  };

  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      key="step6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Professional Summary</h2>

      <p className="text-gray-600 mt-4 mb-6 text-sm leading-relaxed">
        A strong 3–4 sentence summary at the top of your CV is the first thing recruiters read. Our AI generates one
        based on your work history, skills, and the target job.
      </p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Your Summary</label>
          {generating ? (
            <button
              onClick={handleCancelGeneration}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-300 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel AI
            </button>
          ) : (
            <button
              onClick={() => handleGenerate()}
              className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 bg-mint-50 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Generate
            </button>
          )}
        </div>

        {/* Loading indicator */}
        {generating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full flex-shrink-0"
            />
            <p className="text-xs text-primary font-medium">AI is generating your professional summary…</p>
          </motion.div>
        )}

        {/* Placeholder warning alert */}
        {hasPlaceholders && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-900">
                Found {placeholderCount} placeholder{placeholderCount !== 1 ? 's' : ''} to replace
              </p>
              <div className="text-xs text-amber-700 mt-2 flex flex-wrap gap-1.5">
                {uniquePlaceholders.map((placeholder) => (
                  <button
                    key={placeholder}
                    onClick={() => scrollToPlaceholder(placeholder)}
                    className="font-mono font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-1 rounded cursor-pointer transition-colors active:scale-95"
                    title="Click to jump to this placeholder"
                  >
                    {placeholder}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <textarea
          ref={textareaRef}
          rows={6}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={generating}
          placeholder={generating ? 'AI is generating your summary. Please wait…' : "Click 'AI Generate' to create a tailored summary, or write your own…"}
          className={`w-full px-4 py-3 rounded-xl border transition-colors text-sm resize-none overflow-y-auto ${
            generating
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-transparent'
              : hasPlaceholders
              ? 'bg-white border-amber-300 focus:border-amber-500 focus:outline-none'
              : 'bg-gray-50 border-transparent focus:border-primary focus:outline-none focus:bg-white'
          }`}
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-400">Aim for 60–100 words</p>
          <p
            className={`text-xs font-medium ${
              wordCount > 120 ? 'text-danger' : wordCount >= 60 ? 'text-primary' : 'text-gray-400'
            }`}
          >
            {wordCount} words
          </p>
        </div>
        {reasoning && (
          <p className="text-xs text-gray-500 mt-2 italic">{reasoning}</p>
        )}
      </div>

      {wordCount >= 60 && wordCount <= 120 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-mint-50 border border-primary/20 mb-4"
        >
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <p className="text-xs text-gray-600">Great length! Recruiters spend ~6 seconds on the summary.</p>
        </motion.div>
      )}

      <div className="flex justify-between mt-4 pb-6 lg:pb-0 gap-3">
        <Button variant="outline" size="md" onClick={prevStep} className="hidden lg:inline-flex">
          ← Previous
        </Button>
        <Button
          size="lg"
          onClick={handleNext}
          disabled={hasPlaceholders}
          title={hasPlaceholders ? 'Replace all [X] placeholders before continuing' : ''}
          className={`w-full lg:w-auto ${hasPlaceholders ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Save & Continue →
        </Button>
      </div>

      <PaymentModal
        isOpen={paymentGate.showPaymentModal}
        onClose={paymentGate.closePaymentModal}
        onPaymentSuccess={paymentGate.retryAfterPayment}
        aiFeatureName={paymentGate.aiFeatureName}
        requiredCredits={paymentGate.requiredCredits}
      />
    </motion.div>
  );
}
