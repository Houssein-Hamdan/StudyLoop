import { BookOpen, SearchX } from 'lucide-react';

import SearchLessonCard from './SearchLessonCard';

import type { SearchLesson } from '../types';

type SearchResultsProps = {
  results: SearchLesson[];
  isLoading: boolean;
  hasQuery: boolean;
};

function SearchSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-xl bg-[var(--surface)]"
        />
      ))}
    </div>
  );
}

export default function SearchResults({
  results,
  isLoading,
  hasQuery,
}: SearchResultsProps) {
  if (!hasQuery) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
        <SearchX
          size={30}
          className="mx-auto text-[var(--muted)]"
        />

        <p className="mt-3 font-medium">
          Search your lessons
        </p>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Start typing to find a lesson.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
        <BookOpen
          size={30}
          className="mx-auto text-[var(--muted)]"
        />

        <p className="mt-3 font-medium">
          No lessons found
        </p>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((lesson) => (
        <SearchLessonCard
          key={lesson.id}
          lesson={lesson}
        />
      ))}
    </div>
  );
}