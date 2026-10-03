import { AlertCircle } from "lucide-react";

import ContinueLearning from "../components/ContinueLearning";
import QuickStats from "../components/QuickStats";
import ReviewDue from "../components/ReviewDue";
import RecentActivity from "../components/RecentActivity";

import {
  useHomeActivity,
  useHomeReviews,
  useHomeStats,
} from "../hooks/useHome";

function HomeSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="h-8 w-40 animate-pulse rounded-lg bg-[var(--surface)]" />

        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-[var(--surface)]" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-[var(--surface)]"
          />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-2xl bg-[var(--surface)]" />

      <div className="h-64 animate-pulse rounded-2xl bg-[var(--surface)]" />
    </div>
  );
}

export default function HomePage() {
  const statsQuery = useHomeStats();

  const activityQuery = useHomeActivity();

  const reviewsQuery = useHomeReviews();

  const isLoading =
    statsQuery.isLoading || activityQuery.isLoading || reviewsQuery.isLoading;

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (statsQuery.isError || activityQuery.isError || reviewsQuery.isError) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <AlertCircle size={30} className="mx-auto text-[var(--danger)]" />

        <h2 className="mt-3 font-semibold">Unable to load your dashboard</h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Something went wrong while loading your learning data.
        </p>
      </div>
    );
  }

  const stats = statsQuery.data?.stats;

  const activity = activityQuery.data ?? [];

  const reviews = reviewsQuery.data?.reviews ?? [];

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Greeting */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back 👋
        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Keep learning and build your knowledge.
        </p>
      </header>

      {/* Stats */}
      <QuickStats
        totalLessons={stats.totalLessons}
        totalTopics={stats.totalTopics}
        completedTopics={stats.totalCompleted}
        completionRate={stats.averageCompletion}
      />

      {/* Continue + Reviews */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ContinueLearning lessons={activity} />

        <ReviewDue
          reviews={reviews.map((review) => ({
            lessonId: review.lesson.id,
            containerId: review.lesson.containerId,
            lessonTitle: review.lesson.title,
          }))}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity lessons={activity} />
    </div>
  );
}
