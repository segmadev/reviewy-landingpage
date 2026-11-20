interface Props {
  links?: string[];
  color: string;
  fontSize: number;   // already scaled (px)
  scale?: number;
}

/** Ensures a stored link opens externally even when saved without a protocol. */
function toHref(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/** Shows a link without protocol or trailing slash, e.g. "segma.dev". */
function toLabel(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

/** Clickable list of portfolio links, one per line. Opens in a new tab and stays clickable in exported PDFs. */
export default function PortfolioLinks({ links, color, fontSize, scale: s = 1 }: Props) {
  const items = (links ?? []).map(l => l.trim()).filter(Boolean);
  if (!items.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${3 * s}px` }}>
      {items.map((link, i) => (
        <a
          key={`portfolio-${i}`}
          href={toHref(link)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: `${4 * s}px`,
            fontSize: `${fontSize}px`,
            color,
            fontWeight: 600,
            textDecoration: 'none',
            borderBottom: `${0.75 * s}px solid currentColor`,
            alignSelf: 'flex-start',
            wordBreak: 'break-all' as const,
            lineHeight: 1.4,
          }}
        >
          {toLabel(link)}
          <span aria-hidden="true" style={{ fontSize: `${fontSize * 0.9}px` }}>↗</span>
        </a>
      ))}
    </div>
  );
}
