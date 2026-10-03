import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type LessonHeaderProps = {
  containerId: string;
  title: string;
  topicsCount: number;
};

export function LessonHeader({
  containerId,
  title,
  topicsCount,
}: LessonHeaderProps) {
  return (
    <header className="space-y-3 sm:space-y-4">
      {/* Back Link */}
      <Link
        to={`/containers/${containerId}`}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] transition hover:text-[var(--foreground)] sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Container
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
              Lesson
            </span>
            <span className="text-xs text-[var(--muted)]">•</span>
            <span className="text-xs text-[var(--muted)]">
              {topicsCount} {topicsCount === 1 ? 'topic' : 'topics'}
            </span>
          </div>

          <h1 className="mt-1 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl md:text-3xl">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}