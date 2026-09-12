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
    description: '',
  },
  terms: {
    title: 'Terms & Conditions',
    description: '',
  },
  disclaimer: {
    title: 'Disclaimer',
    description: '',
  },
  cookies: {
    title: 'Cookie Policy',
    description: '',
  },
  refunds: {
    title: 'Refund Policy',
    description: '',
  },
};
