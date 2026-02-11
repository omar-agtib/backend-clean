import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./translations/en";
import { fr } from "./translations/fr";

function detectLang() {
  const url = new URL(window.location.href);
  const q = url.searchParams.get("lang");
  if (q === "fr" || q === "en") return q;
  const saved = localStorage.getItem("lang");
  if (saved === "fr" || saved === "en") return saved;
  return navigator.language.startsWith("fr") ? "fr" : "en";
}

const lang = detectLang();
localStorage.setItem("lang", lang);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: lang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
