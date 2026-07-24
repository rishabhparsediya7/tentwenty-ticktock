import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed",
  secondary:
    "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 disabled:opacity-60",
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand/40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
