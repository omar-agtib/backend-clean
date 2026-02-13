/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--fg))",

        card: "hsl(var(--card))",
        "card-fg": "hsl(var(--card-fg))",

        muted: "hsl(var(--muted))",
        "muted-fg": "hsl(var(--muted-fg))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",

        primary: "hsl(var(--primary))",
        "primary-fg": "hsl(var(--primary-fg))",

        secondary: "hsl(var(--secondary))",

        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",

        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [],
};
