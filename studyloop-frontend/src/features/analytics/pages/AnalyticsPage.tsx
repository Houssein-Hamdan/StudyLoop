import { BookOpen, CheckCircle2, FileText, Target } from "lucide-react";

import { useAnalyticsOverview } from "../hooks/useAnalytics";

import AnalyticsStatCard from "../components/AnalyticsStatCard";
import ProgressOverview from "../components/ProgressOverview";
import RecentActivity from "../components/RecentActivity";
import QuizPerformance from "../components/QuizPerformance";
import ProgressChart from "../components/ProgressChart";

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-32 animate-pulse rounded-lg bg-[var(--surface)]" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-[var(--surface)]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-[var(--surface)]"
          />
        ))}
      </div>

      <div className="h-48 animate-pulse rounded-2xl bg-[var(--surface)]" />

      <div className="h-80 animate-pulse rounded-2xl bg-[var(--surface)]" />

      <div className="h-80 animate-pulse rounded-2xl bg-[var(--surface)]" />
    </div>
  );
}

function AnalyticsError() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <h2 className="font-semibold">Unable to load analytics</h2>

      <p className="mt-2 text-sm text-[var(--muted)]">
        Something went wrong while loading your analytics.
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalyticsOverview();

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (isError || !data) {
    return <AnalyticsError />;
  }

  const { overview, recentActivity, quizzes } = data;

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>

        <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
          Understand your learning progress and performance.
        </p>
      </header>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Overview</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <AnalyticsStatCard
            title="Total Lessons"
            value={overview.totalLessons}
            icon={BookOpen}
          />

          <AnalyticsStatCard
            title="Total Topics"
            value={overview.totalTopics}
            icon={FileText}
          />

          <AnalyticsStatCard
            title="Completed Topics"
            value={overview.completedTopics}
            icon={CheckCircle2}
          />

          <AnalyticsStatCard
            title="Completion Rate"
            value={overview.globalCompletionRate}
            suffix="%"
            icon={Target}
          />

          <AnalyticsStatCard
            title="Annotations"
            value={overview.totalAnnotations}
            icon={FileText}
          />
        </div>
      </section>

      <ProgressOverview
        completedTopics={overview.completedTopics}
        totalTopics={overview.totalTopics}
        completionRate={overview.globalCompletionRate}
      />

      <ProgressChart lessons={recentActivity} />

      <RecentActivity lessons={recentActivity} />

      <QuizPerformance quizzes={quizzes} />
    </div>
  );
}
