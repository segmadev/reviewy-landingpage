import { Sparkles } from 'lucide-react';

export type ContentSource = 'ai' | 'user';

interface SourceBadgeProps {
  source: ContentSource;
  userLabel?: string;
}

export default function SourceBadge({ source, userLabel = 'Written by you' }: SourceBadgeProps) {
  if (source === 'ai') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-mint-50 px-2 py-0.5 text-[10px] font-semibold text-primary">
        <Sparkles aria-hidden="true" className="w-2.5 h-2.5" />
        AI suggested
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-500">
      {userLabel}
    </span>
  );
}
