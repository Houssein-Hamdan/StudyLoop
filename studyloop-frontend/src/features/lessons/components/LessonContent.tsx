import { BookOpen } from 'lucide-react';

import type { Topic } from '../types';
import { TopicCompletionButton } from './TopicCompletionButton';

type LessonContentProps = {
  topic: Topic | null;
  completed: boolean;
  isUpdating: boolean;
  onToggleComplete: () => void;
};

export function LessonContent({
  topic,
  completed,
  isUpdating,
  onToggleComplete,
}: LessonContentProps) {
  if (!topic) {
    return (
      <section className="flex min-h-96 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="text-center">
          <BookOpen
            size={32}
            className="mx-auto text-[var(--muted)]"
          />

          <h2 className="mt-4 font-semibold">
            No topic selected
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Select a topic from the sidebar to start learning.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <BookOpen size={16} />

            <span>Topic</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {topic.title}
          </h1>
        </div>

        <div className="shrink-0">
          <TopicCompletionButton
            completed={completed}
            isPending={isUpdating}
            onToggle={onToggleComplete}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-8">
        {topic.description ? (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              About this topic
            </h2>

            <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-[var(--foreground)]">
              {topic.description}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center">
            <p className="text-sm text-[var(--muted)]">
              No content has been added to this topic yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}