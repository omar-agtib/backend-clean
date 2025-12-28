type Props = {
  title?: string;
  subtitle?: string;
  isSpinning?: boolean;
};

export default function SiteLoader({
  title = "Loading…",
  subtitle = "Please wait",
  isSpinning = true,
}: Props) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <svg
            viewBox="0 0 64 64"
            className={`h-8 w-8 ${isSpinning ? "animate-spin" : ""}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M32 6C17.64 6 6 17.64 6 32s11.64 26 26 26 26-11.64 26-26"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M42 20l10-2-2 10"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-2/3 bg-slate-900 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
