import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Wordle feedback palette
        correct: "#6aaa64",
        present: "#c9b458",
        absent: "#787c7e",
        // Surfaces / ink
        paper: "#fbfbf8",
        ink: "#121213",
        // Neutral greys
        line: "#e4e4e0",
        tile: "#d8d8d2",
        muted: "#6b6b66",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Libre Franklin"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 #e4e4e0, 0 18px 40px -28px rgba(18,18,19,0.25)",
      },
    },
  },
  plugins: [typography],
};
