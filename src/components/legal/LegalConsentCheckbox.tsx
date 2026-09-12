interface LegalConsentCheckboxProps {
  checked: boolean;
  id: string;
  onChange: (checked: boolean) => void;
}

export default function LegalConsentCheckbox({
  checked,
  id,
  onChange,
}: LegalConsentCheckboxProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-gray-300 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
      <label htmlFor={id} className="text-xs leading-5 text-gray-600">
        I agree to ReviewyMe’s{' '}
        <a
          href="/terms"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-gray-800 underline decoration-gray-400 underline-offset-2 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Terms &amp; Conditions
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-gray-800 underline decoration-gray-400 underline-offset-2 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Privacy Policy
        </a>
        .
      </label>
    </div>
  );
}
