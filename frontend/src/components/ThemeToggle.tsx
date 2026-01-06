import { useEffect, useState } from "react";
import {
  getInitialTheme,
  setTheme,
  type ThemeMode,
  toggleTheme,
} from "../lib/theme";

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    setTheme(mode);
  }, [mode]);

  return (
    <button
      type="button"
      className="btn-outline px-3 py-2"
      onClick={() => {
        toggleTheme();
        setMode(
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        );
      }}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="text-base">{mode === "dark" ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">
        {mode === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
