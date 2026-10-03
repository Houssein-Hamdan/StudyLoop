import {
  ArrowRight,
  BookOpen,
  CalendarClock,
} from 'lucide-react';

import type { DueReview } from '../types';
import { getReviewIntervalLabel } from '../utils';

type ReviewCardProps = {
  review: DueReview;
  onStart: () => void;
};

export function ReviewCard({
  review,
  onStart,
}: ReviewCardProps) {
  const {
    lesson,
    completedTopicsCount,
    totalTopicsCount,
    completionPercentage,
    reviewCount,
    reviewIntervalDays,
  } = review;

  return (
    <article
      className="
        rounded-2xl
        border border-[var(--border)]
        bg-[var(--surface)]
        p-5
        transition
        hover:bg-[var(--surface-hover)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              bg-[var(--primary)]
              text-[var(--primary-foreground)]
            "
          >
            <BookOpen size={20} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">
              {lesson.title}
            </h2>

            <div className="mt-1 flex items-center gap-2 text-sm text-[var(--muted)]">
              <span>Due today</span>

              <span>•</span>

              <span>
                Review #{reviewCount + 1}
              </span>
            </div>
          </div>
        </div>

        <CalendarClock
          size={18}
          className="shrink-0 text-[var(--warning)]"
        />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">
            Topics completed
          </span>

          <span className="font-medium">
            {completedTopicsCount}/{totalTopicsCount}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all"
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>{completionPercentage}% complete</span>

          <span>
            Next interval: {getReviewIntervalLabel(reviewIntervalDays || 1)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="
          mt-5
          flex w-full items-center justify-center gap-2
          rounded-xl
          bg-[var(--primary)]
          px-4 py-3
          text-sm font-medium
          text-[var(--primary-foreground)]
          transition
          hover:opacity-90
        "
      >
        Start Review
        <ArrowRight size={17} />
      </button>
    </article>
  );
}