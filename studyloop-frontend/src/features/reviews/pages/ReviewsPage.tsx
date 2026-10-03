import {
  CalendarCheck2,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ReviewCard } from '../components/ReviewCard';
import { useDueReviews } from '../hooks/useReviews';

export function ReviewsPage() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useDueReviews();

  const reviews = data?.reviews ?? [];
  const count = data?.count ?? 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[var(--primary)]">
              <CalendarCheck2 size={17} />
              <span>Spaced Repetition</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Reviews
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
              {count === 0
                ? 'You are all caught up.'
                : `You have ${count} lesson${
                    count === 1 ? '' : 's'
                  } to review today.`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              self-start
              rounded-xl
              border border-[var(--border)]
              bg-[var(--surface)]
              px-4 py-2.5
              text-sm font-medium
              transition
              hover:bg-[var(--surface-hover)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={16}
              className={isFetching ? 'animate-spin' : ''}
            />

            Refresh
          </button>
        </div>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                h-64
                animate-pulse
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
              "
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="
            rounded-2xl
            border border-[var(--danger)]
            bg-[var(--surface)]
            p-6
          "
        >
          <h2 className="font-semibold">
            Could not load your reviews
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Something went wrong while loading due reviews.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="
              mt-4
              rounded-xl
              bg-[var(--primary)]
              px-4 py-2.5
              text-sm font-medium
              text-[var(--primary-foreground)]
            "
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && reviews.length === 0 && (
        <div
          className="
            flex
            min-h-80
            flex-col
            items-center
            justify-center
            rounded-2xl
            border border-dashed
            border-[var(--border)]
            bg-[var(--surface)]
            px-6
            text-center
          "
        >
          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-[var(--surface-hover)]
            "
          >
            <CalendarCheck2
              size={26}
              className="text-[var(--success)]"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            No reviews due
          </h2>

          <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
            You have completed all your scheduled reviews.
            Come back when your next lessons are due.
          </p>
        </div>
      )}

      {/* Reviews */}
      {!isLoading && !isError && reviews.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onStart={() =>
                navigate(
                  `/containers/${review.lesson.containerId}/lessons/${review.lesson.id}/review`,
                )
              }
            />
          ))}
        </section>
      )}
    </main>
  );
}