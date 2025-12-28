import { useTranslation } from "react-i18next";

export function LoadingScreen({ label }: { label?: string }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <SiteSVG />
          <div>
            <div className="text-lg font-semibold text-slate-900">
              {t("common.appName")}
            </div>
            <div className="text-sm text-slate-600">
              {label ?? t("common.loading")}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-2 w-1/2 bg-brand-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteSVG() {
  // Simple chantier SVG (inline, no assets needed)
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden
    >
      <rect
        x="6"
        y="28"
        width="36"
        height="26"
        rx="4"
        stroke="#0f172a"
        strokeWidth="2"
      />
      <path d="M6 38h36" stroke="#0f172a" strokeWidth="2" />
      <path d="M16 54V28" stroke="#0f172a" strokeWidth="2" />
      <path d="M26 54V28" stroke="#0f172a" strokeWidth="2" />
      <path d="M52 54V18" stroke="#0f172a" strokeWidth="2" />
      <path d="M52 18c0-5 4-9 9-9" stroke="#0f172a" strokeWidth="2" />
      <path d="M52 24h10" stroke="#0f172a" strokeWidth="2" />
      <circle cx="61" cy="9" r="2" fill="#0f172a" />
      <path d="M42 54h16" stroke="#0f172a" strokeWidth="2" />
      <path d="M42 54V44c0-3 2-5 5-5h5" stroke="#0f172a" strokeWidth="2" />
      <path d="M47 39v-9" stroke="#0f172a" strokeWidth="2" />
      <path d="M47 30h-5" stroke="#0f172a" strokeWidth="2" />
      <path d="M10 24l6-8 6 8" stroke="#0f172a" strokeWidth="2" />
      <path d="M16 16v12" stroke="#0f172a" strokeWidth="2" />
      <path d="M28 24l6-8 6 8" stroke="#0f172a" strokeWidth="2" />
      <path d="M34 16v12" stroke="#0f172a" strokeWidth="2" />
    </svg>
  );
}
