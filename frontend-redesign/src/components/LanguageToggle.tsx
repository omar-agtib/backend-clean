'use client';

import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "fr" ? "fr" : "en") as "en" | "fr";

  function setLang(next: "en" | "fr") {
    localStorage.setItem("lang", next);
    i18n.changeLanguage(next);

    // keep URL param support
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <button
        className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
          lang === "en"
            ? "btn-primary"
            : "btn-ghost text-mutedForeground hover:text-foreground"
        }`}
        onClick={() => setLang("en")}
        type="button"
        title="English"
      >
        EN
      </button>
      <button
        className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
          lang === "fr"
            ? "btn-primary"
            : "btn-ghost text-mutedForeground hover:text-foreground"
        }`}
        onClick={() => setLang("fr")}
        type="button"
        title="Français"
      >
        FR
      </button>
    </div>
  );
}
