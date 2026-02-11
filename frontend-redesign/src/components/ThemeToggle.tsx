'use client';

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
      className="btn-secondary gap-2 px-4 py-2.5 text-sm font-medium"
      onClick={() => {
        toggleTheme();
        setMode(
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        );
      }}
      aria-label="Toggle theme"
      title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    >
      <span className="text-lg">
        {mode === "dark" ? "🌙" : "☀️"}
      </span>
      <span className="hidden sm:inline text-xs font-semibold">
        {mode === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
