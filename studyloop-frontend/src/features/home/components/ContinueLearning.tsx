import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { HomeActivity } from '../types';

type ContinueLearningProps = {
  lessons: HomeActivity[];
};

export default function ContinueLearning({
  lessons,
}: ContinueLearningProps) {
  const inProgress = lessons.filter(
    (lesson) =>
      lesson.progressPercentage > 0 &&
      lesson.progressPercentage < 100,
  );

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Continue Learning
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Pick up where you left off.
          </p>
        </div>

        <Link
          to="/library"
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Library
        </Link>
      </div>

      {inProgress.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <BookOpen
            size={28}
            className="mx-auto text-[var(--muted)]"
          />

          <p className="mt-3 font-medium">
            Nothing in progress
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Start a lesson and come back here to continue.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inProgress.slice(0, 3).map((lesson) => (
            <Link
              key={lesson.lessonId}
              to={`/containers/${lesson.containerId}/lessons/${lesson.lessonId}`}
              className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-hover)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-hover)]">
                <BookOpen size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">
                  {lesson.lessonTitle}
                </h3>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                  <div
                    className="h-full rounded-full bg-[var(--primary)]"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          lesson.progressPercentage,
                          0,
                        ),
                        100,
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  {lesson.progressPercentage}% complete
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