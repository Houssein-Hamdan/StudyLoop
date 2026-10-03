import type { LucideIcon } from 'lucide-react';

type AnalyticsStatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  suffix?: string;
};

export default function AnalyticsStatCard({
  title,
  value,
  icon: Icon,
  suffix,
}: AnalyticsStatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs text-[var(--muted)] sm:text-sm">
            {title}
          </p>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight sm:text-3xl">
              {value}
            </span>

            {suffix && (
              <span className="text-xs text-[var(--muted)] sm:text-sm">
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-[var(--surface-hover)] p-2.5 sm:p-3">
          <Icon size={18} className="sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}