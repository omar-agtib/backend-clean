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
    <div className="flex items-center gap-2">
      <button
        className={
          lang === "en" ? "btn-primary px-3 py-2" : "btn-outline px-3 py-2"
        }
        onClick={() => setLang("en")}
        type="button"
      >
        EN
      </button>
      <button
        className={
          lang === "fr" ? "btn-primary px-3 py-2" : "btn-outline px-3 py-2"
        }
        onClick={() => setLang("fr")}
        type="button"
      >
        FR
      </button>
    </div>
  );
}
