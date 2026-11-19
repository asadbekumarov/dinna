import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        cream: {
          "50": "#FCFBF9",
          "100": "#FAF8F5",
          "200": "#F2EFE9",
          "300": "#E5E0D8",
          "400": "#D6CFC4",
          DEFAULT: "#FAF8F5",
        },
        sage: {
          DEFAULT: "#2E5A44",
          hover: "#234735",
          light: "#3D7056",
          dark: "#1B3829",
          soft: "rgba(46, 90, 68, 0.08)",
          dim: "rgba(46, 90, 68, 0.15)",
        },
        terracotta: {
          DEFAULT: "#C59B6D",
          light: "#D8B48D",
          hover: "#B58A5B",
          dark: "#9E7445",
          text: "#8A6236",
          soft: "rgba(197, 155, 109, 0.12)",
        },
        charcoal: {
          DEFAULT: "#1F2924",
          light: "#2E3B33",
          muted: "#5C6660",
        },
        border: {
          DEFAULT: "#E5E0D8",
          subtle: "#EFEBE3",
          strong: "#D5CEC4",
        },
        muted: {
          DEFAULT: "#5C6660",
          light: "#78827C",
          dark: "#3D4741",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(46, 90, 68, 0.06)",
        card: "0 4px 20px rgba(31, 41, 36, 0.05)",
        glow: "0 10px 30px rgba(46, 90, 68, 0.12)",
        modal: "0 20px 50px rgba(31, 41, 36, 0.15)",
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        md: "14px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Plus Jakarta Sans",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "Cormorant Garamond",
          "Georgia",
          "serif",
        ],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "monospace",
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
