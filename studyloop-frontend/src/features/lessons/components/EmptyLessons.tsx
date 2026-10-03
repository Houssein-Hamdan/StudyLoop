import { BookOpen, Plus } from "lucide-react";

import { Link } from "react-router-dom";

type EmptyLessonsProps = {
  containerId: string;
};

export function EmptyLessons({ containerId }: EmptyLessonsProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
        <BookOpen size={24} />
      </div>

      <h3 className="mt-4 text-lg font-semibold">No lessons yet</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
        Add your first lesson and start building your knowledge base.
      </p>

      <Link
        to={`/containers/${containerId}/lessons/new`}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
      >
        <Plus size={17} />
        Create Lesson
      </Link>
    </div>
  );
}
