import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import type { RecentActivity } from "../types";

type ProgressChartProps = {
  lessons: RecentActivity[];
};

export default function ProgressChart({ lessons }: ProgressChartProps) {
  const chartData = lessons.map((lesson) => ({
    name:
      lesson.lessonTitle.length > 16
        ? `${lesson.lessonTitle.slice(0, 16)}...`
        : lesson.lessonTitle,
    progress: lesson.progressPercentage,
  }));

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Lesson Progress</h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Completion percentage of your recent lessons.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        {chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
            No lesson progress available yet.
          </div>
        ) : (
          <div className="h-64 w-full min-w-0 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 5,
                  left: -25,
                  bottom: 10,
                }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "var(--muted)",
                    fontSize: 10,
                  }}
                  axisLine={{
                    stroke: "var(--border)",
                  }}
                  tickLine={false}
                  interval={0}
                />

                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{
                    fill: "var(--muted)",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [`${value}%`, "Progress"]}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                  }}
                  cursor={{
                    fill: "var(--surface-hover)",
                  }}
                />

                <Bar
                  dataKey="progress"
                  fill="var(--primary)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}
