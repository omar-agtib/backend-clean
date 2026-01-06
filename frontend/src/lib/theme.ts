const THEME_KEY = "theme";
export type ThemeMode = "light" | "dark";

function prefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return prefersDark() ? "dark" : "light";
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function setTheme(mode: ThemeMode) {
  localStorage.setItem(THEME_KEY, mode);
  applyTheme(mode);
}

export function toggleTheme() {
  const next: ThemeMode = document.documentElement.classList.contains("dark")
    ? "light"
    : "dark";
  setTheme(next);
}

export function initTheme() {
  applyTheme(getInitialTheme());
}
