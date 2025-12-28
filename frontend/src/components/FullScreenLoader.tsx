import LogoMark from "./LogoMark";

export default function FullScreenLoader({ title }: { title?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="text-slate-900">
          <LogoMark className="h-14 w-14" />
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold">
            {title ?? "Loading workspace..."}
          </p>
          <p className="text-sm text-slate-500">Preparing chantier data</p>
        </div>

        <div className="h-2 w-56 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-slate-900" />
        </div>
      </div>
    </div>
  );
}
