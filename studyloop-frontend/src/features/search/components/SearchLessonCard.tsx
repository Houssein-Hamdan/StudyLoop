import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { SearchLesson } from '../types';

type SearchLessonCardProps = {
  lesson: SearchLesson;
};

export default function SearchLessonCard({
  lesson,
}: SearchLessonCardProps) {
  const containerId = lesson.containerId || lesson.container?.id;

  return (
    <Link
      to={`/containers/${containerId}/lessons/${lesson.id}`}
      className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-hover)]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-hover)]">
        <BookOpen size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium">
          {lesson.title}
        </h3>

        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
          {lesson.totalTopics !== undefined && (
            <span>
              {lesson.completedTopics ?? 0} /{' '}
              {lesson.totalTopics} topics
            </span>
          )}

          {lesson.completionPercentage !== undefined && (
            <span>
              {lesson.completionPercentage}%
            </span>
          )}
        </div>
      </div>

      <ArrowRight
        size={18}
        className="shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}