import React from "react";

interface BotanicalMotifProps {
  className?: string;
  variant?: "branch" | "leaf" | "divider" | "corner";
  color?: string;
}

export function BotanicalMotif({
  className = "",
  variant = "branch",
  color = "#C49A6C",
}: BotanicalMotifProps) {
  if (variant === "leaf") {
    return (
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M12 48C18 36 28 22 48 12C42 26 34 38 12 48Z"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 42C24 33 32 24 44 16"
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "corner") {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M10 90C25 70 38 48 58 28C68 18 78 12 90 10"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 3"
          strokeOpacity="0.4"
        />
        <path
          d="M30 65C38 58 48 48 62 44C58 56 50 64 30 65Z"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.75"
        />
        <path
          d="M45 48C52 40 64 32 78 30C72 40 64 48 45 48Z"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.85"
        />
        <circle cx="88" cy="12" r="2.5" fill={color} fillOpacity="0.7" />
      </svg>
    );
  }

  if (variant === "divider") {
    return (
      <div className={`flex items-center justify-center gap-4 py-6 ${className}`} aria-hidden="true">
        <span className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#C49A6C]/40" />
        <svg
          width="28"
          height="14"
          viewBox="0 0 28 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#C49A6C]/80"
        >
          <path
            d="M1 7C6 2 9 2 14 7C19 12 22 12 27 7"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle cx="14" cy="7" r="1.5" fill={color} />
        </svg>
        <span className="h-[1px] w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#C49A6C]/40" />
      </div>
    );
  }

  // Default: Organic Branch Motif
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 60C35 48 65 35 110 18"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      {/* Delicate Leaf 1 */}
      <path
        d="M38 48C45 40 56 36 62 40C58 48 48 50 38 48Z"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
        strokeOpacity="0.85"
      />
      {/* Delicate Leaf 2 */}
      <path
        d="M66 35C74 26 84 24 90 28C85 36 76 38 66 35Z"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
        strokeOpacity="0.85"
      />
      {/* Opposite Leaf 3 */}
      <path
        d="M52 42C48 32 38 28 32 34C38 40 48 42 52 42Z"
        stroke={color}
        strokeWidth="0.9"
        strokeLinejoin="round"
        strokeOpacity="0.65"
      />
      <circle cx="110" cy="18" r="2" fill={color} fillOpacity="0.75" />
    </svg>
  );
}
