import { useState } from 'react';
import { Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'reviewyme_cookie_consent_v1';

type CookieConsentChoice = 'all' | 'essential';

function hasSavedChoice(): boolean {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
  } catch {
    return false;
  }
}

function saveChoice(choice: CookieConsentChoice): void {
  try {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ choice, version: 1, savedAt: new Date().toISOString() })
    );
  } catch {
    // The current visit can still respect the choice when storage is unavailable.
  }
}

export default function CookieConsentBanner() {
  // Shown globally as a privacy-first fallback until a trusted first-party
  // country signal is available. This guarantees coverage for EU/UK visitors
  // without sending an IP address to a third-party geolocation service.
  const [isVisible, setIsVisible] = useState(() => !hasSavedChoice());

  const choose = (choice: CookieConsentChoice) => {
    saveChoice(choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-5xl rounded-2xl border border-white/10 bg-gray-950 p-4 text-white shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-5"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Cookie aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Your privacy choices</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-300">
              ReviewyMe uses essential storage to keep your session and CV draft. Optional cookies will only be used with your permission. Read our{' '}
              <a
                href="/cookies"
                className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Cookie Policy
              </a>
              .
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col-reverse gap-2 min-[420px]:flex-row">
          <button
            type="button"
            onClick={() => choose('essential')}
            className="min-h-11 cursor-pointer rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-white/15"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => choose('all')}
            className="min-h-11 cursor-pointer rounded-full bg-primary px-5 text-sm font-semibold text-gray-950 transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:brightness-90"
          >
            Accept all
          </button>
        </div>
      </div>
    </section>
  );
}
