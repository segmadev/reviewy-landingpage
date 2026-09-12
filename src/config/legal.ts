export type LegalDocumentSlug = 'privacy' | 'terms' | 'disclaimer' | 'cookies' | 'refunds';

export interface LegalLink {
  label: string;
  href: `/${LegalDocumentSlug}`;
}

export const LEGAL_LINKS: LegalLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Refunds', href: '/refunds' },
];

export const LEGAL_DOCUMENTS: Record<
  LegalDocumentSlug,
  { title: string; description: string }
> = {
  privacy: {
    title: 'Privacy Policy',
    description: 'ReviewyMe’s approved privacy information will be published on this page.',
  },
  terms: {
    title: 'Terms & Conditions',
    description: 'ReviewyMe’s approved terms and conditions will be published on this page.',
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'ReviewyMe’s approved disclaimer will be published on this page.',
  },
  cookies: {
    title: 'Cookie Policy',
    description: 'ReviewyMe’s approved cookie and local-storage information will be published on this page.',
  },
  refunds: {
    title: 'Refund Policy',
    description: 'ReviewyMe’s approved refund policy will be published on this page.',
  },
};
