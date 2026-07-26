import { ReactNode } from "react";

export type BadgeTheme = "green" | "yellow" | "pink" | "gray";
export type BadgeSize = "small" | "medium";

const THEMES: Record<BadgeTheme, string> = {
  green: "bg-status-completed-bg text-status-completed-fg",
  yellow: "bg-status-incomplete-bg text-status-incomplete-fg",
  pink: "bg-status-missing-bg text-status-missing-fg",
  gray: "bg-gray-100 text-gray-600",
};

const SIZES: Record<BadgeSize, string> = {
  small: "px-2.5 py-0.5 text-xs",
  medium: "px-3 py-1 text-sm",
};

export interface BadgeProps {
  /** "Badge text" in Figma. */
  text: string;
  /** "Theme" — the color scheme. */
  theme?: BadgeTheme;
  /** "Size". */
  size?: BadgeSize;
  /** "Show text". */
  showText?: boolean;
  /** "Show icon" — renders the leading `icon` node. */
  showIcon?: boolean;
  /** "Show close icon" — renders a trailing dismiss button. */
  showCloseIcon?: boolean;
  icon?: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Badge({
  text,
  theme = "gray",
  size = "small",
  showText = true,
  showIcon = false,
  showCloseIcon = false,
  icon,
  onClose,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-medium ${THEMES[theme]} ${SIZES[size]} ${className}`}
    >
      {showIcon && icon}
      {showText && <span>{text}</span>}
      {showCloseIcon && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Remove"
          className="-mr-0.5 ml-0.5 leading-none opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </span>
  );
}
