import { BookOpen } from 'lucide-react';
import type { Topic } from '../types';

type TopicContentProps = {
  topic: Topic | null;
};

export function TopicContent({ topic }: TopicContentProps) {
  if (!topic) {
    return (
      <section className="flex min-h-[400px] flex-1 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-sm px-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <BookOpen size={22} />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            Select a topic
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Choose a topic from the sidebar to start learning.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <BookOpen size={16} />

          <span>Topic</span>
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          {topic.title}
        </h1>

        <div className="mt-8">
          {topic.description ? (
            <p className="whitespace-pre-wrap text-base leading-8 text-[var(--muted)]">
              {topic.description}
            </p>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
              No description available for this topic yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}