import Link from "next/link";

type LogoProps = {
  /** Visual size variant. */
  size?: "sm" | "md" | "lg";
  /** Hide the wordmark and show only the icon. */
  iconOnly?: boolean;
};

const sizeClasses = {
  sm: { icon: "size-7 rounded-md", text: "text-base" },
  md: { icon: "size-9 rounded-lg", text: "text-lg" },
  lg: { icon: "size-12 rounded-xl", text: "text-2xl" },
} as const;

export default function Logo({ size = "md", iconOnly = false }: LogoProps) {
  const s = sizeClasses[size];

  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <span
        className={`${s.icon} inline-flex shrink-0 items-center justify-center bg-primary-600 text-white shadow-sm`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-1/2"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          <path d="M10 8.5 13.5 12 10 15.5" />
        </svg>
      </span>
      {!iconOnly && (
        <span className={`${s.text} font-display font-semibold tracking-tight`}>
          Libra<span className="text-primary-600">AI</span>
        </span>
      )}
    </Link>
  );
}
