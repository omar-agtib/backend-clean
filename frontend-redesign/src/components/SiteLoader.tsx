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
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-primary text-primaryForeground flex items-center justify-center shadow-soft">
          <svg
            viewBox="0 0 24 24"
            className={["h-6 w-6", isSpinning ? "animate-spin" : ""].join(" ")}
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.25"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-extrabold">{title}</h1>
          <p className="text-sm text-mutedForeground">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full w-2/3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
