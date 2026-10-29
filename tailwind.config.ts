import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      /* ---- Color tokens (map to CSS custom properties) ---- */
      colors: {
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",

        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",

        /* ---- Semantic / domain colors ---- */

        /* ---- Dedicated Dual-Theme Chip Tokens ---- */
        "chip-emotional": {
          DEFAULT:    "hsl(var(--chip-emotional))",
          foreground: "hsl(var(--chip-emotional-foreground))",
          border:     "hsl(var(--chip-emotional-border))",
        },
        "chip-legal": {
          DEFAULT:    "hsl(var(--chip-legal))",
          foreground: "hsl(var(--chip-legal-foreground))",
          border:     "hsl(var(--chip-legal-border))",
        },

        /* ---- Semantic / domain colors ---- */
        emergency: {
          bg:     "hsl(var(--destructive) / 0.12)",
          border: "hsl(var(--destructive) / 0.4)",
          text:   "hsl(var(--destructive))",
          badge:  "hsl(var(--destructive))",
        },
        caution: {
          bg:     "hsl(var(--caution-bg))",
          border: "hsl(var(--caution-border))",
          text:   "hsl(var(--caution-text))",
          badge:  "hsl(var(--caution-text))",
        },
        verified: {
          bg:     "hsl(var(--secondary))",
          border: "hsl(var(--border))",
          text:   "hsl(var(--primary))",
          badge:  "hsl(var(--primary))",
        },
        privacy: {
          bg:     "hsl(var(--muted))",
          border: "hsl(var(--border))",
          text:   "hsl(var(--foreground))",
          badge:  "hsl(var(--primary))",
        },
      },

      /* ---- Border radius scale ---- */
      borderRadius: {
        xs:   "var(--radius-xs)",
        sm:   "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "9999px",
      },

      /* ---- Box shadows ---- */
      boxShadow: {
        xs:  "var(--shadow-xs)",
        sm:  "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md:  "var(--shadow-md)",
        lg:  "var(--shadow-lg)",
      },

      /* ---- Font sizes (extend with design system scale) ---- */
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        xs:    ["0.75rem",   { lineHeight: "1rem" }],
        sm:    ["0.875rem",  { lineHeight: "1.25rem" }],
        base:  ["1rem",     { lineHeight: "1.5rem" }],
        lg:    ["1.125rem",  { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",   { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem",    { lineHeight: "2rem" }],
        "3xl": ["1.875rem",  { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem",   { lineHeight: "2.5rem" }],
        "5xl": ["3rem",      { lineHeight: "1" }],
        "6xl": ["3.75rem",   { lineHeight: "1" }],
        "7xl": ["4.5rem",    { lineHeight: "1" }],
      },

      /* ---- Spacing additions ---- */
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
      },

      /* ---- Max widths for reading columns ---- */
      maxWidth: {
        "prose-xs": "45ch",
        "prose":    "65ch",
        "prose-lg": "80ch",
      },

      /* ---- Animation ---- */
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-top": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-safe": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in":     "fade-in 0.25s ease-out",
        "slide-in-top":"slide-in-top 0.2s ease-out",
        "pulse-safe":  "pulse-safe 2s ease-in-out infinite",
      },

      /* ---- Typography families ---- */
      fontFamily: {
        sans:  ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono:  ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },

      /* ---- Screen breakpoints (unchanged, documented) ---- */
      screens: {
        sm:   "640px",
        md:   "768px",
        lg:   "1024px",
        xl:   "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};

export default config;
