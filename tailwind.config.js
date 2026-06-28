/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // The monograph palette. A dark warm cover, a warm off-white "paper"
        // body, and a single warm sienna accent. Deliberately NOT purple /
        // navy+gold. One source of truth for both the cover and the body.
        //
        // Cover (the dark hero ground) and its two foreground tints.
        cover: {
          DEFAULT: "#0e0e0d", // deep warm ink
          fg: "#f5f3ee", // paper-white title
          soft: "#d8d6cf", // subtitle on the cover
        },
        // Body "paper": warm off-white, with a slightly deeper raised surface
        // for thumbnails and insets.
        paper: {
          DEFAULT: "#f3f0ea",
          raised: "#efece6",
        },
        // Ink, from primary text down to faint hairline separators.
        ink: {
          DEFAULT: "#1a1916",
          soft: "#43403a", // blurbs / secondary prose
        },
        muted: "#6f6a60", // mono author/year, captions
        faint: "#c8c1b4", // in-text separators
        rule: "#ddd7cc", // hairline rules between rows
        // The single warm accent, with a deeper pressed/hover tone.
        accent: {
          DEFAULT: "#a45a32", // sienna
          deep: "#7e3f1e", // hover / pressed
          ink: "#7e3f1e", // alias kept for detail-page links
          soft: "#eeeae5",
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
