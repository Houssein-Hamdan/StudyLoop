import { ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export type ReviewDueItem = {
  lessonId: string;
  containerId: string;
  lessonTitle: string;
};

// يتقبل إما Array بشكل مباشر أو Object يحتوي على القائمة (DueReviewsResponse)
type ReviewDueProps = {
  reviews: ReviewDueItem[] | { reviews?: ReviewDueItem[]; items?: ReviewDueItem[] } | undefined;
};

export default function ReviewDue({
  reviews,
}: ReviewDueProps) {
  // استخراج قائمة المراجعات بسلاسة
  const reviewList = Array.isArray(reviews)
    ? reviews
    : reviews?.reviews || reviews?.items || [];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Reviews Due
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Keep your knowledge fresh.
          </p>
        </div>

        <Link
          to="/reviews"
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          All reviews
        </Link>
      </div>

      {reviewList.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--surface-hover)] p-3">
              <RotateCcw size={20} />
            </div>

            <div>
              <p className="font-medium">
                You are all caught up
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                No reviews are due right now.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {reviewList.slice(0, 3).map((review) => (
            <Link
              key={review.lessonId}
              to={`/containers/${review.containerId}/lessons/${review.lessonId}/review`}
              className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-hover)]"
            >
              <div className="rounded-xl bg-[var(--surface-hover)] p-3">
                <RotateCcw size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {review.lessonTitle}
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Review due
                </p>
              </div>

              <ArrowRight
                size={18}
                className="shrink-0 text-[var(--muted)]"
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}