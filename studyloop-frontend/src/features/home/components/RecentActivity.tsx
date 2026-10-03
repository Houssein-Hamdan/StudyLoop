import { ArrowRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { HomeActivity } from '../types';

type RecentActivityProps = {
  lessons: HomeActivity[];
};

export default function RecentActivity({
  lessons,
}: RecentActivityProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Your latest learning activity.
          </p>
        </div>

        <Link
          to="/analytics"
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          View all
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <Clock3
            size={28}
            className="mx-auto text-[var(--muted)]"
          />

          <p className="mt-3 font-medium">
            No recent activity
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Your recent lessons will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          {lessons.slice(0, 5).map((lesson, index) => (
            <Link
              key={lesson.lessonId}
              to={`/containers/${lesson.containerId}/lessons/${lesson.lessonId}`}
              className={`flex items-center gap-3 p-4 transition-colors hover:bg-[var(--surface-hover)] ${
                index !== lessons.length - 1
                  ? 'border-b border-[var(--border)]'
                  : ''
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-hover)]">
                <Clock3 size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {lesson.lessonTitle}
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  {lesson.completedTopics} /{' '}
                  {lesson.totalTopics} topics
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--muted)]">
                  {lesson.progressPercentage}%
                </span>

                <ArrowRight
                  size={16}
                  className="text-[var(--muted)]"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}