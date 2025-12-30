/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "hsl(var(--accent, 222 81% 55%))",
        },
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};
