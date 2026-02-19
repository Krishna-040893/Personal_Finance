interface BlueprintBookIconProps {
  className?: string;
  size?: number;
}

export function BlueprintBookIcon({
  className,
  size = 24,
}: BlueprintBookIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Page fills */}
      <path
        d="M3 5.5C3 4.12 4.12 3 5.5 3H11.5C11.78 3 12 3.22 12 3.5V20.5C12 20.78 11.78 21 11.5 21H5.5C4.12 21 3 19.88 3 18.5V5.5Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M21 5.5C21 4.12 19.88 3 18.5 3H12.5C12.22 3 12 3.22 12 3.5V20.5C12 20.78 12.22 21 12.5 21H18.5C19.88 21 21 19.88 21 18.5V5.5Z"
        fill="currentColor"
        opacity="0.1"
      />

      {/* Blueprint grid — horizontal lines (left page) */}
      <line x1="5.5" y1="7" x2="10.5" y2="7" stroke="currentColor" opacity="0.35" strokeWidth="0.6" />
      <line x1="5.5" y1="10" x2="10.5" y2="10" stroke="currentColor" opacity="0.35" strokeWidth="0.6" />
      <line x1="5.5" y1="13" x2="10.5" y2="13" stroke="currentColor" opacity="0.35" strokeWidth="0.6" />
      <line x1="5.5" y1="16" x2="10.5" y2="16" stroke="currentColor" opacity="0.35" strokeWidth="0.6" />

      {/* Blueprint grid — horizontal lines (right page) */}
      <line x1="13.5" y1="7" x2="18.5" y2="7" stroke="currentColor" opacity="0.35" strokeWidth="0.6" />
      <line x1="13.5" y1="10" x2="18.5" y2="10" stroke="currentColor" opacity="0.35" strokeWidth="0.6" />
      <line x1="13.5" y1="13" x2="18.5" y2="13" stroke="currentColor" opacity="0.35" strokeWidth="0.6" />
      <line x1="13.5" y1="16" x2="18.5" y2="16" stroke="currentColor" opacity="0.35" strokeWidth="0.6" />

      {/* Vertical margin lines (ledger reference) */}
      <line x1="7.5" y1="5" x2="7.5" y2="19" stroke="currentColor" opacity="0.18" strokeWidth="0.5" />
      <line x1="16.5" y1="5" x2="16.5" y2="19" stroke="currentColor" opacity="0.18" strokeWidth="0.5" />

      {/* Book outline */}
      <path
        d="M3 5.5C3 4.12 4.12 3 5.5 3H11.5C11.78 3 12 3.22 12 3.5V20.5C12 20.78 11.78 21 11.5 21H5.5C4.12 21 3 19.88 3 18.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 5.5C21 4.12 19.88 3 18.5 3H12.5C12.22 3 12 3.22 12 3.5V20.5C12 20.78 12.22 21 12.5 21H18.5C19.88 21 21 19.88 21 18.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
