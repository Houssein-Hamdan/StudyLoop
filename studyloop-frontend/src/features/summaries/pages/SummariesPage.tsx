import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

import {
  useDeleteSummary,
  useSummaries,
} from '../hooks/useSummaries';

import type { Summary } from '../api';

function getDepthLabel(depth: Summary['depth']) {
  switch (depth) {
    case 'short':
      return 'Short';

    case 'medium':
      return 'Medium';

    case 'detailed':
      return 'Detailed';
  }
}

function getDepthDescription(depth: Summary['depth']) {
  switch (depth) {
    case 'short':
      return 'Quick review';

    case 'medium':
      return 'Balanced review';

    case 'detailed':
      return 'Deep review';
  }
}

export function SummariesPage() {
  const { containerId, lessonId } = useParams();

  const [expandedSummaryId, setExpandedSummaryId] =
    useState<string | null>(null);

  const summariesQuery = useSummaries(
    containerId ?? '',
    lessonId ?? '',
  );

  const deleteSummaryMutation = useDeleteSummary(
    containerId ?? '',
    lessonId ?? '',
  );

  const summaries: Summary[] = summariesQuery.data ?? [];

  function toggleSummary(summaryId: string) {
    setExpandedSummaryId((current) =>
      current === summaryId ? null : summaryId,
    );
  }

  function handleDelete(summary: Summary) {
    const confirmed = window.confirm(
      `Delete the ${getDepthLabel(summary.depth).toLowerCase()} summary?`,
    );

    if (!confirmed) {
      return;
    }

    deleteSummaryMutation.mutate(summary.id);

    if (expandedSummaryId === summary.id) {
      setExpandedSummaryId(null);
    }
  }

  if (summariesQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="h-10 w-64 animate-pulse rounded bg-[var(--surface-hover)]" />

        <div className="mt-6 space-y-4">
          <div className="h-32 animate-pulse rounded-2xl bg-[var(--surface)]" />
          <div className="h-32 animate-pulse rounded-2xl bg-[var(--surface)]" />
        </div>
      </div>
    );
  }

  if (summariesQuery.isError) {
    return (
      <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--surface)] p-6">
        <h2 className="font-semibold">
          Unable to load summaries
        </h2>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-[var(--primary)]">
          <FileText size={16} />

          <span>Lesson Summaries</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Your summaries
        </h1>

        <p className="mt-2 text-sm text-[var(--muted)]">
          View the summaries generated for this lesson.
        </p>
      </div>

      {summaries.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <FileText
            size={32}
            className="mx-auto text-[var(--muted)]"
          />

          <h2 className="mt-4 font-semibold">
            No summaries yet
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Generate a summary from this lesson to see it here.
          </p>
        </section>
      ) : (
        <div className="mt-8 space-y-4">
          {summaries.map((summary) => {
            const isExpanded =
              expandedSummaryId === summary.id;

            return (
              <article
                key={summary.id}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="flex items-center justify-between gap-4 p-5">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSummary(summary.id)
                    }
                    className="flex min-w-0 flex-1 items-center gap-4 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">
                          {getDepthLabel(summary.depth)}
                        </h2>

                        <span className="rounded-full bg-[var(--surface-hover)] px-2.5 py-1 text-xs text-[var(--muted)]">
                          {getDepthDescription(summary.depth)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Created{' '}
                        {new Date(
                          summary.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(summary)
                      }
                      disabled={
                        deleteSummaryMutation.isPending
                      }
                      className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] disabled:opacity-50"
                      title="Delete summary"
                    >
                      <Trash2 size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleSummary(summary.id)
                      }
                      className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--surface-hover)]"
                      title={
                        isExpanded
                          ? 'Hide summary'
                          : 'View summary'
                      }
                    >
                      {isExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-[var(--border)] px-5 py-6">
                    <div className="whitespace-pre-wrap text-sm leading-7">
                      {summary.content}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}