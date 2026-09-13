import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Cookie,
  FileText,
  Home,
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
  const ActiveDocumentIcon = DOCUMENT_ICONS[`/${slug}`];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    document.title = `${content.title} — ReviewyMe`;
  }, [content.title]);

  return (
    <main className="relative isolate min-h-[calc(100vh-88px)] overflow-hidden bg-white">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="ReviewyMe home"
          >
            <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-7 w-auto" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary/40 hover:bg-gray-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 lg:hidden">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-primary/40 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <FileText aria-hidden="true" className="size-4 text-gray-600" />
              {content.title}
            </div>
            <ChevronDown
              aria-hidden="true"
              className={`size-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <nav aria-label="Legal documents" className="mt-2 space-y-2">
              {LEGAL_LINKS.map((item) => {
                const isActive = item.href === `/${slug}`;
                const ItemIcon = DOCUMENT_ICONS[item.href];

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
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

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
          <aside className="hidden self-start lg:block lg:sticky lg:top-20">
            <nav aria-label="Legal documents" className="space-y-2">
              {LEGAL_LINKS.map((item) => {
                const isActive = item.href === `/${slug}`;
                const ItemIcon = DOCUMENT_ICONS[item.href];

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
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

          <article aria-labelledby="legal-document-title" className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <header className="border-b border-gray-100 px-6 py-8 sm:px-8 sm:py-10">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  ReviewyMe legal &amp; trust
                </p>
                <h1 id="legal-document-title" className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  {content.title}
                </h1>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {content.description}
                </p>
              </div>
            </header>

            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <section aria-labelledby="policy-status-heading" className="py-6">
                <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-5">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                    <FileText aria-hidden="true" className="size-5" />
                  </span>
                  <div className="max-w-2xl">
                    <h2 id="policy-status-heading" className="text-base font-bold text-gray-950">
                      Approved content is required
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Approved legal copy has not been supplied.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      Once the final document is supplied, it can be published here.
                    </p>
                  </div>
                </div>
              </section>

              <div className="mt-8 flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="font-semibold text-gray-900">Return to ReviewyMe</p>
                  <p className="mt-1 text-sm text-gray-600">Explore more features and get started.</p>
                </div>
                <Link
                  to="/"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Home aria-hidden="true" className="size-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
