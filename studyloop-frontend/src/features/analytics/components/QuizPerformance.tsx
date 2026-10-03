import { BarChart3, Trophy } from "lucide-react";

import type { QuizAnalytics } from "../types";

type QuizPerformanceProps = {
  quizzes: QuizAnalytics;
};

export default function QuizPerformance({ quizzes }: QuizPerformanceProps) {
  const score = Math.min(Math.max(quizzes.averageScore, 0), 100);

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Quiz Performance</h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Your quiz activity and average performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Quizzes Taken */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">Quizzes Taken</p>

              <p className="mt-2 text-3xl font-bold sm:text-4xl">
                {quizzes.totalTaken}
              </p>
            </div>

            <div className="rounded-xl bg-[var(--surface-hover)] p-3">
              <BarChart3 size={22} />
            </div>
          </div>

          <p className="mt-4 text-sm text-[var(--muted)]">
            Total quizzes you have completed.
          </p>
        </div>

        {/* Average Score */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">Average Score</p>

              <p className="mt-2 text-3xl font-bold sm:text-4xl">{score}%</p>
            </div>

            <div className="rounded-xl bg-[var(--surface-hover)] p-3">
              <Trophy size={22} />
            </div>
          </div>

          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                style={{
                  width: `${score}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
