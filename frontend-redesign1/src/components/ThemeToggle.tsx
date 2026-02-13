import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
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
      className="flex items-center justify-center h-10 w-10 rounded-xl bg-card border border-border hover:bg-muted transition duration-200"
      onClick={() => {
        toggleTheme();
        setMode(
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        );
      }}
      aria-label="Toggle theme"
      title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    >
      {mode === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
