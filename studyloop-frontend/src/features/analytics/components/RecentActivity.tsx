import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RecentActivity as RecentActivityType } from '../types';

type RecentActivityProps = {
  lessons: RecentActivityType[];
};

function formatLastAccessed(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RecentActivity({
  lessons,
}: RecentActivityProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Your recently accessed lessons.
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <BookOpen
            size={28}
            className="mx-auto text-[var(--muted)]"
          />

          <p className="mt-3 font-medium">
            No recent activity
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Start studying a lesson and it will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.lessonId}
              className={`p-4 sm:p-5 ${
                index !== lessons.length - 1
                  ? 'border-b border-[var(--border)]'
                  : ''
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Lesson info */}
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="hidden shrink-0 rounded-xl bg-[var(--surface-hover)] p-3 sm:block">
                    <BookOpen size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">
                      {lesson.lessonTitle}
                    </h3>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)] sm:text-sm">
                      <span>
                        {lesson.completedTopics} / {lesson.totalTopics} topics
                      </span>

                      <span className="hidden sm:inline">
                        •
                      </span>

                      <span>
                        {formatLastAccessed(lesson.lastAccessedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress + action */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1 lg:w-48 lg:flex-none">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-[var(--muted)]">
                        Progress
                      </span>

                      <span className="font-medium">
                        {lesson.progressPercentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                      <div
                        className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
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
                  </div>

                  <Link
                    to={`/containers/${lesson.containerId}/lessons/${lesson.lessonId}`}
                    className="shrink-0 rounded-lg p-2 transition-colors hover:bg-[var(--surface-hover)]"
                    aria-label={`Open ${lesson.lessonTitle}`}
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}