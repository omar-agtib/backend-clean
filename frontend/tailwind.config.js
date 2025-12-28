/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5fbff",
          100: "#e6f5ff",
          200: "#c7e9ff",
          300: "#97d6ff",
          400: "#5abaff",
          500: "#2a93ff",
          600: "#1f73db",
          700: "#1c5bb1",
          800: "#1c4d90",
          900: "#1b4276",
        },
        success: "#16a34a",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};
