/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#8BCF00",
          "primary-content": "#111827",
          secondary: "#111827",
          "secondary-content": "#ffffff",
          accent: "#78B300",
          "accent-content": "#111827",
          neutral: "#18181b",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f7f1",
          "base-300": "#e5e7eb",
          "base-content": "#111827",
          info: "#2563eb",
          success: "#16a34a",
          warning: "#f59e0b",
          error: "#dc2626",
        },
      },
      {
        dark: {
          primary: "#8BCF00",
          "primary-content": "#111827",
          secondary: "#f8fafc",
          "secondary-content": "#111827",
          accent: "#A7F022",
          "accent-content": "#111827",
          neutral: "#0f172a",
          "neutral-content": "#f8fafc",
          "base-100": "#111827",
          "base-200": "#0f172a",
          "base-300": "#1f2937",
          "base-content": "#f8fafc",
          info: "#60a5fa",
          success: "#22c55e",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
    ],
  },

}
