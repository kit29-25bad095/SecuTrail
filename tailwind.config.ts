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

        /* Sage — calm healing green (safety, nature, trust) */
        sage: {
          50:  "#f3f7f4",
          100: "#e4ede6",
          200: "#c6daca",
          300: "#9abfa1",
          400: "#6b9e74",
          500: "#4d8157",
          600: "#3b6743",
          700: "#305337",
          800: "#28432d",
          900: "#223826",
          950: "#111d14",
        },

        /* Warm slate — primary UI surface tones */
        slate: {
          50:  "#f7f8fa",
          100: "#eef0f4",
          200: "#d9dde6",
          300: "#bcc3d0",
          400: "#96a0b4",
          500: "#758096",
          600: "#5e677c",
          700: "#4c5364",
          800: "#404655",
          900: "#383d4a",
          950: "#1e2130",
        },

        /* Emergency / alert */
        emergency: {
          bg:     "#fef2f2",
          border: "#fecaca",
          text:   "#991b1b",
          badge:  "#dc2626",
        },

        /* Caution / time-sensitive */
        caution: {
          bg:     "#fffbeb",
          border: "#fde68a",
          text:   "#92400e",
          badge:  "#d97706",
        },

        /* Verified / safe */
        verified: {
          bg:     "#f0fdf4",
          border: "#bbf7d0",
          text:   "#166534",
          badge:  "#16a34a",
        },

        /* Privacy / neutral info */
        privacy: {
          bg:     "#f0f6ff",
          border: "#bfdbfe",
          text:   "#1e3a5f",
          badge:  "#2563eb",
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
