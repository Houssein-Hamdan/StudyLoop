import { useState } from 'react';

import SearchInput from '../components/SearchInput';
import SearchResults from '../components/SearchResults';

import { useSearchLessons } from '../hooks/useSearchLessons';

import type {
  SearchLessonSort,
  SearchLessonStatus,
} from '../types';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const [status, setStatus] =
    useState<SearchLessonStatus>('all');

  const [sortBy, setSortBy] =
    useState<SearchLessonSort>('newest');

  const searchQuery = query.trim();

  const { data, isLoading, isError } =
    useSearchLessons({
      query: searchQuery,
      status,
      sortBy,
      take: 10,
    });

  const results = data?.lessons ?? [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Search
        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Find lessons across your library.
        </p>
      </header>

      <SearchInput
        value={query}
        onChange={setQuery}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {(
            [
              ['all', 'All'],
              ['in_progress', 'In Progress'],
              ['mastered', 'Mastered'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={[
                'shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                status === value
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)]',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(event) =>
            setSortBy(
              event.target.value as SearchLessonSort,
            )
          }
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most_completed">
            Most completed
          </option>
        </select>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="font-medium">
            Unable to search lessons
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Something went wrong. Please try again.
          </p>
        </div>
      ) : (
        <SearchResults
          results={results}
          isLoading={isLoading}
          hasQuery={Boolean(searchQuery)}
        />
      )}
    </div>
  );
}