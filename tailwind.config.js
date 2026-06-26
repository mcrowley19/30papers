/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Editorial palette. Pure white page, near-black ink, one restrained
        // warm accent. Deliberately NOT purple / navy+gold.
        ink: "#141414",
        paper: "#ffffff",
        muted: "#6b6b6b",
        rule: "#e7e4df",
        accent: {
          DEFAULT: "#3a3a3a", // restrained dark neutral (no red)
          soft: "#eeeae5",
          ink: "#1f1f1f",
        },
      },
      fontFamily: {
        serif: ['"CMU Serif"', "Newsreader", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        tech: ["Geist", "Inter", "system-ui", "sans-serif"],
        techmono: ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      maxWidth: {
        reading: "56rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "panel-in": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "panel-in": "panel-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
