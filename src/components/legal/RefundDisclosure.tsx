interface RefundDisclosureProps {
  compact?: boolean;
}

export default function RefundDisclosure({ compact = false }: RefundDisclosureProps) {
  return (
    <p className={`${compact ? 'text-[11px]' : 'text-xs'} mt-3 text-center leading-5 text-gray-500`}>
      Purchases are non-refundable once credits are spent. View our{' '}
      <a
        href="/refunds"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-gray-700 underline decoration-gray-400 underline-offset-2 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Refund Policy
      </a>
      .
    </p>
  );
}
