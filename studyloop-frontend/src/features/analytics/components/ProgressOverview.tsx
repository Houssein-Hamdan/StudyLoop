import { Target } from 'lucide-react';

type ProgressOverviewProps = {
  completedTopics: number;
  totalTopics: number;
  completionRate: number;
};

export default function ProgressOverview({
  completedTopics,
  totalTopics,
  completionRate,
}: ProgressOverviewProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Overall Progress</h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Your overall learning completion.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--muted)]">
              Global completion
            </p>

            <p className="mt-1 text-3xl font-bold sm:text-4xl">
              {completionRate}%
            </p>
          </div>

          <div className="shrink-0 rounded-xl bg-[var(--surface-hover)] p-3 sm:p-4">
            <Target size={22} className="sm:h-6 sm:w-6" />
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(completionRate, 0),
                  100,
                )}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <span className="text-[var(--muted)]">
              {completedTopics} of {totalTopics} topics completed
            </span>

            <span className="shrink-0 font-medium">
              {completionRate}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}