import { useEffect } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LEGAL_DOCUMENTS, type LegalDocumentSlug } from '../../config/legal';

interface LegalPageProps {
  document: LegalDocumentSlug;
}

export default function LegalPage({ document: slug }: LegalPageProps) {
  const content = LEGAL_DOCUMENTS[slug];

  useEffect(() => {
    document.title = `${content.title} — ReviewyMe`;
  }, [content.title]);

  return (
    <main className="min-h-[calc(100vh-88px)] bg-gray-50 px-4 py-8 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-semibold text-gray-600 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to ReviewyMe
        </Link>

        <article className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-950 px-6 py-8 text-white sm:px-10 sm:py-10">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <FileText aria-hidden="true" className="size-5" />
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{content.title}</h1>
          </div>
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-base leading-7 text-gray-700">{content.description}</p>
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-6 text-amber-900">
                Approved legal copy has not been supplied in this project. This page is intentionally a publishing destination only and does not create or replace binding legal terms.
              </p>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
