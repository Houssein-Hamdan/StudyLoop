import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useLesson } from '../../lessons/hooks/useLessons';
import { useLessonProgress } from '../../progress/hooks/useProgress';
import { useCompleteReview } from '../hooks/useReviews';

export function ReviewSessionPage() {
  const {
    containerId = '',
    lessonId = '',
  } = useParams<{
    containerId: string;
    lessonId: string;
  }>();

  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanation, setShowExplanation] =
    useState(false);
  const [completed, setCompleted] = useState(false);

  const lessonQuery = useLesson(
    containerId,
    lessonId,
  );

  const progressQuery = useLessonProgress(
    containerId,
    lessonId,
  );

  const completeReviewMutation =
    useCompleteReview(
      containerId,
      lessonId,
    );

  const lesson = lessonQuery.data;
  const topics = lesson?.topics ?? [];

  const currentTopic = topics[currentIndex];

  const progress = progressQuery.data?.progress;

  const progressPercentage = useMemo(() => {
    if (!topics.length) return 0;

    return Math.round(
      ((currentIndex + 1) / topics.length) * 100,
    );
  }, [currentIndex, topics.length]);

  function goBack() {
    navigate('/reviews');
  }

  function handleNext() {
    if (currentIndex < topics.length - 1) {
      setCurrentIndex((value) => value + 1);
      setShowExplanation(false);
      return;
    }

    handleCompleteReview();
  }

  function handlePrevious() {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((value) => value - 1);
    setShowExplanation(false);
  }

  async function handleCompleteReview() {
    try {
      await completeReviewMutation.mutateAsync();

      setCompleted(true);
    } catch {
      // mutation error is displayed below
    }
  }

  if (
    lessonQuery.isLoading ||
    progressQuery.isLoading
  ) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--surface)]" />
        <div className="mt-6 h-96 animate-pulse rounded-2xl bg-[var(--surface)]" />
      </main>
    );
  }

  if (
    lessonQuery.isError ||
    !lesson
  ) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h1 className="text-lg font-semibold">
            Could not load review
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            The lesson could not be loaded.
          </p>

          <button
            type="button"
            onClick={goBack}
            className="mt-5 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)]"
          >
            Back to Reviews
          </button>
        </div>
      </main>
    );
  }

  if (completed) {
    const nextReviewDate =
      completeReviewMutation.data?.progress
        .nextReviewDate;

    return (
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-4 py-8">
        <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)] text-white">
            <Check size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Review completed
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            Nice work. Your next review has been scheduled.
          </p>

          {nextReviewDate && (
            <p className="mt-4 text-sm font-medium">
              Next review:{' '}
              {new Intl.DateTimeFormat('en', {
                dateStyle: 'medium',
              }).format(
                new Date(nextReviewDate),
              )}
            </p>
          )}

          <button
            type="button"
            onClick={goBack}
            className="
              mt-7
              rounded-xl
              bg-[var(--primary)]
              px-5 py-3
              text-sm font-medium
              text-[var(--primary-foreground)]
            "
          >
            Back to Reviews
          </button>
        </div>
      </main>
    );
  }

  if (!currentTopic) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h1 className="text-lg font-semibold">
            Nothing to review
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            This lesson does not contain any topics yet.
          </p>

          <button
            type="button"
            onClick={goBack}
            className="mt-5 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)]"
          >
            Back to Reviews
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Top navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          className="
            inline-flex items-center gap-2
            text-sm font-medium
            text-[var(--muted)]
            transition
            hover:text-[var(--foreground)]
          "
        >
          <ArrowLeft size={17} />
          Reviews
        </button>

        <span className="text-sm text-[var(--muted)]">
          {currentIndex + 1} / {topics.length}
        </span>
      </div>

      {/* Lesson header */}
      <section className="mt-8">
        <p className="text-sm font-medium text-[var(--primary)]">
          Review: {lesson.title}
        </p>

        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          {currentTopic.title}
        </h1>

        {/* Session progress */}
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs text-[var(--muted)]">
            <span>Review progress</span>
            <span>{progressPercentage}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Review card */}
      <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Topic
          </span>

          <h2 className="mt-3 text-xl font-semibold">
            {currentTopic.title}
          </h2>

          <div className="mt-6 rounded-2xl bg-[var(--background)] p-5">
            <p className="text-sm leading-7 text-[var(--foreground)]">
              Think about this topic and try to recall
              what you learned before revealing the
              explanation.
            </p>

            {!showExplanation ? (
              <button
                type="button"
                onClick={() =>
                  setShowExplanation(true)
                }
                className="
                  mt-5
                  rounded-xl
                  border border-[var(--border)]
                  px-4 py-2.5
                  text-sm font-medium
                  transition
                  hover:bg-[var(--surface-hover)]
                "
              >
                Show explanation
              </button>
            ) : (
              <div className="mt-5 border-t border-[var(--border)] pt-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
                  {currentTopic.description ||
                    'No explanation is available for this topic.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleNext}
            disabled={
              completeReviewMutation.isPending
            }
            className="
              inline-flex flex-1
              items-center justify-center gap-2
              rounded-xl
              bg-[var(--success)]
              px-4 py-3
              text-sm font-semibold
              text-white
              transition
              hover:opacity-90
              disabled:opacity-50
            "
          >
            <Check size={18} />

            {currentIndex === topics.length - 1
              ? 'I remember — Complete Review'
              : 'I remember'}
          </button>

          <button
            type="button"
            onClick={() =>
              setShowExplanation(true)
            }
            className="
              inline-flex flex-1
              items-center justify-center gap-2
              rounded-xl
              border border-[var(--border)]
              px-4 py-3
              text-sm font-semibold
              transition
              hover:bg-[var(--surface-hover)]
            "
          >
            <RotateCcw size={17} />

            Need more review
          </button>
        </div>

        {completeReviewMutation.isError && (
          <p className="mt-4 text-sm text-[var(--danger)]">
            Could not complete the review. Please try
            again.
          </p>
        )}
      </section>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="
            inline-flex items-center gap-2
            rounded-xl
            px-3 py-2
            text-sm font-medium
            transition
            hover:bg-[var(--surface-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={
            completeReviewMutation.isPending
          }
          className="
            inline-flex items-center gap-2
            rounded-xl
            px-3 py-2
            text-sm font-medium
            transition
            hover:bg-[var(--surface-hover)]
            disabled:opacity-50
          "
        >
          {currentIndex === topics.length - 1
            ? 'Complete'
            : 'Next'}

          <ChevronRight size={18} />
        </button>
      </div>

      {/* Existing progress info */}
      {progress && (
        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          Lesson progress: {progress.completedTopicsCount}/
          {progress.totalTopicsCount} topics completed
        </p>
      )}
    </main>
  );
}