import daisyui from "daisyui";
import scrollbar from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,svelte}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [daisyui, scrollbar],
  daisyui: {
    themes: ["light"],
  },
};
