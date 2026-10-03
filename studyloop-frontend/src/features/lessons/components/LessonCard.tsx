import { BookOpen, ChevronRight } from "lucide-react";

import { Link } from "react-router-dom";

import type { Lesson } from "../types";

type LessonCardProps = {
  lesson: Lesson;
  containerId: string;
};

export function LessonCard({ lesson, containerId }: LessonCardProps) {
  const topicsCount = lesson.topics.length;

  return (
    <Link
      to={`/containers/${containerId}/lessons/${lesson.id}`}
      className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
          <BookOpen size={21} />
        </div>

        <ChevronRight
          size={18}
          className="text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--foreground)]"
        />
      </div>

      <h3 className="mt-5 line-clamp-2 text-lg font-semibold">
        {lesson.title}
      </h3>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
        <span className="text-sm text-[var(--muted)]">
          {topicsCount} {topicsCount === 1 ? "topic" : "topics"}
        </span>

        <span className="text-sm font-medium text-[var(--primary)]">Open</span>
      </div>
    </Link>
  );
}
