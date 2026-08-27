import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface ResumeNotFoundModalProps {
  isOpen: boolean;
  isLoading: boolean;
  resumeId: string;
  onConvert: () => void;
  onCancel: () => void;
}

export default function ResumeNotFoundModal({
  isOpen,
  isLoading,
  resumeId,
  onConvert,
  onCancel,
}: ResumeNotFoundModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Resume Not Found</h3>

        {/* Message */}
        <p className="text-gray-600 text-center text-sm mb-4">
          The resume (ID: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{resumeId}</span>)
          could not be found on the server.
        </p>

        <p className="text-gray-600 text-center text-sm mb-6">
          This can happen if the resume was deleted or there's a sync issue. Would you like to save this as a new resume?
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            size="md"
            onClick={onConvert}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Converting...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Convert to New Resume
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
