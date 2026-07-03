/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // The retro-dither palette, matching the landing wordmark and
        // backdrops: deep cobalt ground, cool paper-white body, and the
        // backdrops' cobalt as the single accent. One source of truth for
        // both the cover and the body.
        //
        // Cover (the dark hero ground) and its two foreground tints.
        cover: {
          DEFAULT: "#101f5c", // deep cobalt, the wordmark ground
          fg: "#f6ecd0", // cream title, as in the dither art
          soft: "#cdd5ee", // periwinkle subtitle on the cover
        },
        // Body "paper": cool off-white, with a slightly deeper raised surface
        // for thumbnails and insets.
        paper: {
          DEFAULT: "#f4f5f9",
          raised: "#edeff5",
        },
        // Ink, from primary text down to faint hairline separators.
        ink: {
          DEFAULT: "#16181f",
          soft: "#3f434f", // blurbs / secondary prose
        },
        muted: "#69707f", // mono author/year, captions
        faint: "#c2c8d8", // in-text separators
        rule: "#dbdfea", // hairline rules between rows
        // The single cobalt accent, with a deeper pressed/hover tone.
        accent: {
          DEFAULT: "#1e40af", // cobalt, same as the backdrop BLUE
          deep: "#15307f", // hover / pressed
          ink: "#15307f", // alias kept for detail-page links
          soft: "#e5eaf8",
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
