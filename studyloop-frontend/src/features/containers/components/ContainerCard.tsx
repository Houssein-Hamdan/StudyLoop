import { BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Container } from '../types';

type ContainerCardProps = {
  container: Container;
};

export function ContainerCard({ container }: ContainerCardProps) {
  return (
    <Link
      to={`/containers/${container.id}`}
      className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-lg sm:p-5"
    >
      {/* Header Section: Icon + Title + Chevron bi-nafs el-satr bil-mobile */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] sm:h-11 sm:w-11">
            <BookOpen size={20} />
          </div>

          <h3 className="truncate font-semibold text-base sm:text-lg">
            {container.name}
          </h3>
        </div>

        <ChevronRight
          size={18}
          className="shrink-0 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--foreground)]"
        />
      </div>

      {/* Description */}
      <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2 sm:mt-3 sm:text-sm">
        {container.description || 'No description yet.'}
      </p>

      {/* Footer Section */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs sm:mt-5 sm:pt-4">
        <span className="text-[var(--muted)]">
          Created {new Date(container.createdAt).toLocaleDateString()}
        </span>

        <span className="font-medium text-[var(--primary)] text-xs sm:text-sm">
          Open
        </span>
      </div>
    </Link>
  );
}