import { useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Cookie,
  FileText,
  Home,
  ReceiptText,
  ShieldCheck,
  TriangleAlert,
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

  useEffect(() => {
    document.title = `${content.title} — ReviewyMe`;
  }, [content.title]);

  return (
    <main className="relative isolate min-h-[calc(100vh-88px)] overflow-hidden bg-gradient-to-b from-mint-50/70 via-white to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-16 -z-10 size-80 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-10 -z-10 size-72 rounded-full bg-primary/5 blur-3xl"
      />

      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="ReviewyMe home"
          >
            <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-8 w-auto" />
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-mint-50 px-3 py-1.5 text-xs font-semibold text-gray-700 sm:flex">
            <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
            Legal &amp; trust centre
          </div>

          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-primary/40 hover:bg-mint-50 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary/10"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Back to ReviewyMe</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-14">
        <aside className="self-start lg:sticky lg:top-6">
          <div className="px-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Policy directory</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950">Legal &amp; trust</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
              Access every ReviewyMe policy destination from one clear, consistent place.
            </p>
          </div>

          <nav aria-label="Legal documents" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {LEGAL_LINKS.map((item) => {
              const isActive = item.href === `/${slug}`;
              const ItemIcon = DOCUMENT_ICONS[item.href];

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex min-h-14 items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none ${
                    isActive
                      ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                      : 'border-gray-200 bg-white text-gray-700 shadow-sm hover:border-primary/40 hover:bg-mint-50 hover:text-primary-hover'
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/75 text-primary-hover'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-primary/15 group-hover:text-primary-hover'
                    }`}
                  >
                    <ItemIcon aria-hidden="true" className="size-4" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 hidden rounded-2xl border border-primary/20 bg-mint-50 p-4 lg:block">
            <CheckCircle2 aria-hidden="true" className="size-5 text-primary" />
            <p className="mt-3 text-sm font-semibold text-gray-900">Clear by design</p>
            <p className="mt-1 text-xs leading-5 text-gray-600">
              Permanent policy links are available throughout ReviewyMe.
            </p>
          </div>
        </aside>

        <article
          aria-labelledby="legal-document-title"
          className="overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-2xl shadow-primary/10"
        >
          <header className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-mint-50 via-white to-white px-6 py-10 text-gray-950 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div aria-hidden="true" className="absolute inset-y-0 left-0 w-2 bg-primary" />
            <div aria-hidden="true" className="absolute -right-16 -top-16 size-56 rounded-full border border-primary/20" />
            <div aria-hidden="true" className="absolute -right-8 -top-8 size-36 rounded-full border border-primary/30" />

            <div className="relative max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                  <ActiveDocumentIcon aria-hidden="true" className="size-5" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-hover">ReviewyMe legal centre</p>
              </div>
              <h1 id="legal-document-title" className="mt-7 text-4xl font-bold tracking-tight sm:text-5xl">
                {content.title}
              </h1>
              <div aria-hidden="true" className="mt-5 h-1 w-16 rounded-full bg-primary" />
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
                {content.description}
              </p>
            </div>
          </header>

          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          

            <section aria-labelledby="policy-status-heading" className="py-9 sm:py-10">
              <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6">
                <span className="flex size-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
                  <FileText aria-hidden="true" className="size-5" />
                </span>
                <div className="max-w-2xl">
                  <h2 id="policy-status-heading" className="text-lg font-bold text-gray-950">
                    Approved content is required
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                    Approved legal copy has not been supplied.
                  </p>
                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Once the final document is supplied, it can be published here.
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="font-semibold text-gray-900">Continue with ReviewyMe</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">Return to the homepage whenever you’re ready.</p>
              </div>
              <Link
                to="/"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <Home aria-hidden="true" className="size-4" />
                ReviewyMe home
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
