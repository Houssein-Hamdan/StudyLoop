type QuickStatsProps = {
  totalLessons: number;
  totalTopics: number;
  completedTopics: number;
  completionRate: number;
};

export default function QuickStats({
  totalLessons,
  totalTopics,
  completedTopics,
  completionRate,
}: QuickStatsProps) {
  const stats = [
    {
      label: 'Lessons',
      value: totalLessons,
    },
    {
      label: 'Topics',
      value: totalTopics,
    },
    {
      label: 'Completed',
      value: completedTopics,
    },
    {
      label: 'Completion',
      value: `${completionRate}%`,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
        >
          <p className="text-xs text-[var(--muted)] sm:text-sm">
            {stat.label}
          </p>

          <p className="mt-2 text-2xl font-bold sm:text-3xl">
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
}