import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";

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
    <div className="inline-flex items-center gap-1 h-10 px-1 rounded-xl bg-card border border-border">
      <button
        className={cn(
          "px-3 py-2 rounded-lg text-sm font-medium transition duration-200",
          lang === "en"
            ? "bg-primary text-primaryForeground"
            : "text-foreground hover:bg-muted"
        )}
        onClick={() => setLang("en")}
        type="button"
      >
        EN
      </button>
      <button
        className={cn(
          "px-3 py-2 rounded-lg text-sm font-medium transition duration-200",
          lang === "fr"
            ? "bg-primary text-primaryForeground"
            : "text-foreground hover:bg-muted"
        )}
        onClick={() => setLang("fr")}
        type="button"
      >
        FR
      </button>
    </div>
  );
}
