import React from "react";

/**
 * Editorial Botanical Sprig Illustration
 * Rendered with currentColor for automatic adaptation to both themes
 */
export function BotanicalSprig({ className = "w-6 h-6", opacity = 0.8 }: { className?: string; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <path
        d="M24 44C24 44 24 24 24 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Leaves right */}
      <path
        d="M24 34C28 32 36 32 38 27C36 24 28 26 24 29"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M24 22C28 20 35 19 36 14C33 12 27 15 24 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      {/* Leaves left */}
      <path
        d="M24 28C20 26 12 26 10 21C12 18 20 20 24 23"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M24 16C20 14 13 13 12 8C15 6 21 9 24 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      {/* Top bud */}
      <circle cx="24" cy="5" r="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Editorial Botanical Branch Divider
 */
export function BotanicalDivider({ className = "w-full max-w-xs" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 mx-auto ${className}`} aria-hidden="true">
      <div className="h-px flex-1 bg-border" />
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <path d="M0 8H14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        <path
          d="M17 8C17 8 19 4 20 4C21 4 23 8 23 8C23 8 21 12 20 12C19 12 17 8 17 8Z"
          fill="currentColor"
          fillOpacity="0.25"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="20" cy="8" r="1.5" fill="currentColor" />
        <path d="M26 8H40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      </svg>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/**
 * Editorial Leaf Accent
 */
export function BotanicalLeafCorner({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 6C16 12 28 26 34 42C38 52 42 58 58 58"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.25"
      />
      <path
        d="M20 16C28 14 36 18 38 24C34 26 26 24 20 20"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.08"
        strokeOpacity="0.3"
      />
      <path
        d="M32 30C40 30 46 36 46 42C40 42 34 38 32 34"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.08"
        strokeOpacity="0.3"
      />
    </svg>
  );
}
