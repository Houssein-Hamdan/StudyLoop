type LessonProgressProps = {
  completedTopics: number;
  totalTopics: number;
};

export function LessonProgress({
  completedTopics,
  totalTopics,
}: LessonProgressProps) {
  const percentage =
    totalTopics > 0
      ? Math.round(
          (completedTopics / totalTopics) * 100,
        )
      : 0;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">
            Lesson progress
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {completedTopics} of {totalTopics} topics completed
          </p>
        </div>

        <span className="text-lg font-bold text-[var(--primary)]">
          {percentage}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
        <div
          className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </section>
  );
}