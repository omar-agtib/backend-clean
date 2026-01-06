/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
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

        // ✅ semantic tokens via CSS vars
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--fg))",
        card: "hsl(var(--card))",
        cardForeground: "hsl(var(--card-fg))",
        muted: "hsl(var(--muted))",
        mutedForeground: "hsl(var(--muted-fg))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        primary: "hsl(var(--primary))",
        primaryForeground: "hsl(var(--primary-fg))",
        ring: "hsl(var(--ring))",
      },
      boxShadow: {
        soft: "0 10px 30px -16px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
