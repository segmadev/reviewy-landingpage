import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Cookie,
  FileText,
  ReceiptText,
  ShieldCheck,
  TriangleAlert,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LEGAL_DOCUMENTS,
  LEGAL_LINKS,
  type LegalDocumentSlug,
  type LegalLink,
} from '../../config/legal';

interface LegalPageProps {
  document: LegalDocumentSlug;
}

const DOCUMENT_ICONS: Record<LegalLink['href'], LucideIcon> = {
  '/privacy': ShieldCheck,
  '/terms': FileText,
  '/disclaimer': TriangleAlert,
  '/cookies': Cookie,
  '/refunds': ReceiptText,
};

export default function LegalPage({ document: slug }: LegalPageProps) {
  const content = LEGAL_DOCUMENTS[slug];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    document.title = `${content.title} — ReviewyMe`;
  }, [content.title]);

  return (
    <main className="relative isolate min-h-[calc(100vh-88px)] overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent"
      />

      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="ReviewyMe home"
          >
            <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-6 w-auto" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:border-primary/40 hover:bg-gray-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:border-primary/40 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <FileText aria-hidden="true" className="size-4 text-gray-600" />
              <span className="truncate">{content.title}</span>
            </div>
            <ChevronDown
              aria-hidden="true"
              className={`size-4 shrink-0 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <nav aria-label="Legal documents" className="mt-2 space-y-1">
              {LEGAL_LINKS.map((item) => {
                const isActive = item.href === `/${slug}`;
                const ItemIcon = DOCUMENT_ICONS[item.href];

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ItemIcon aria-hidden="true" className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
          <aside className="hidden self-start lg:block lg:sticky lg:top-16">
            <nav aria-label="Legal documents" className="space-y-1.5">
              {LEGAL_LINKS.map((item) => {
                const isActive = item.href === `/${slug}`;
                const ItemIcon = DOCUMENT_ICONS[item.href];

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isActive
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 shadow-sm hover:border-primary/40 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <ItemIcon aria-hidden="true" className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <article aria-labelledby="legal-document-title" className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
            <header className="border-b border-gray-100 px-4 py-6 sm:px-6 sm:py-7">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
                  ReviewyMe legal &amp; trust
                </p>
                <h1 id="legal-document-title" className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                  {content.title}
                </h1>
                <p className="mt-3 text-sm sm:text-base leading-6 text-gray-600">
                  {content.description}
                </p>
              </div>
            </header>

            <div className="px-4 py-6 sm:px-6 sm:py-7">
              <section aria-labelledby="policy-status-heading" className="py-4">
                <div className="max-w-2xl">
                  <h2 id="policy-status-heading" className="text-sm font-bold text-gray-950">
                    Approved content is required
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-gray-700">
                    Approved legal copy has not been supplied.
                  </p>
                  <p className="mt-2.5 text-sm leading-6 text-gray-600">
                    Once the final document is supplied, it can be published here.
                  </p>
                </div>
              </section>

              <div className="mt-6 flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Return to ReviewyMe</p>
                  <p className="mt-0.5 text-xs text-gray-600">Explore more features and get started.</p>
                </div>
                <Link
                  to="/"
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            <footer className="border-t border-gray-100 px-4 py-4 sm:px-6">
              <nav className="flex flex-wrap items-center gap-4 justify-center">
                {LEGAL_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-xs font-medium text-gray-600 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </footer>
          </article>
        </div>
      </div>
    </main>
  );
}
