import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F4EFE6",
          light: "#FAF7F2",
          card: "#FFFFFF",
          dark: "#EAE3D2",
          border: "#DCD4C4",
        },
        ink: {
          DEFAULT: "#16171D",
          light: "#3A3C47",
          muted: "#6B6E79",
          subtle: "#9BA0A6",
        },
        brand: {
          red: "#D8412F",
          redDark: "#B83120",
          redLight: "#FDF2F0",
        },
        tier: {
          must: "#0F9E63",
          mustBg: "#E8F7F0",
          mustBorder: "#A3E3C7",
          basics: "#C98200",
          basicsBg: "#FFF8E6",
          basicsBorder: "#FCE5A4",
          skip: "#B93826",
          skipBg: "#FDF0ED",
          skipBorder: "#F7C6BE",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "Cambria", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        editorial: "0 2px 0 0 rgba(22, 23, 29, 0.08), 0 1px 3px 0 rgba(22, 23, 29, 0.05)",
        card: "0 1px 3px 0 rgba(22, 23, 29, 0.06), 0 1px 2px 0 rgba(22, 23, 29, 0.04)",
        elevated: "0 10px 25px -5px rgba(22, 23, 29, 0.08), 0 8px 10px -6px rgba(22, 23, 29, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
