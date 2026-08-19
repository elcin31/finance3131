import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0e17",
          900: "#0f1523",
          800: "#161d2e",
          700: "#1e2740",
          600: "#2a3555",
        },
        ink: {
          50: "#f7f8fa",
          100: "#eceef2",
          200: "#d5d9e0",
          300: "#aab1c0",
          400: "#7c869c",
          500: "#5b6478",
          600: "#454d5f",
          700: "#333947",
          800: "#212530",
          900: "#14161c",
        },
        gain: {
          DEFAULT: "#16a34a",
          light: "#dcfce7",
          dark: "#14532d",
        },
        loss: {
          DEFAULT: "#dc2626",
          light: "#fee2e2",
          dark: "#7f1d1d",
        },
        warn: {
          DEFAULT: "#d97706",
          light: "#fef3c7",
          dark: "#78350f",
        },
        accent: {
          DEFAULT: "#2563eb",
          light: "#dbeafe",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Roboto",
          "sans-serif",
        ],
        mono: ["SF Mono", "Roboto Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "0.9rem" }],
      },
    },
  },
  plugins: [],
};

export default config;
