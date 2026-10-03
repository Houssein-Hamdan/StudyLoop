import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FileText, Sparkles } from 'lucide-react';

import { useLesson } from '../../lessons/hooks/useLessons';
import { useCreateSummary } from '../hooks/useSummaries';

import type { SummaryDepth } from '../api';
import type { Topic } from '../../lessons/types';

export function SummaryPage() {
  const { containerId, lessonId } = useParams();

  const [depth, setDepth] = useState<SummaryDepth>('medium');

  const [scope, setScope] = useState<'lesson' | 'selected'>('lesson');

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  const lessonQuery = useLesson(
    containerId ?? '',
    lessonId ?? '',
  );

  const createSummaryMutation = useCreateSummary(
    containerId ?? '',
    lessonId ?? '',
  );

  const lesson = lessonQuery.data;

  // حفظ الـ topics وتحديد النوع بشكل صريح
  const topics = useMemo<Topic[]>(() => {
    return (lesson?.topics as Topic[]) ?? [];
  }, [lesson?.topics]);

  function toggleTopic(topicId: string) {
    setSelectedTopicIds((current) =>
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId],
    );
  }

  function handleGenerate() {
    if (!containerId || !lessonId) {
      return;
    }

    if (scope === 'selected' && selectedTopicIds.length === 0) {
      return;
    }

    createSummaryMutation.mutate({
      depth,
      ...(scope === 'selected' ? { selectedTopicIds } : {}),
    });
  }

  if (lessonQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="h-10 w-72 animate-pulse rounded bg-[var(--surface-hover)]" />
        <div className="mt-6 h-96 animate-pulse rounded-2xl bg-[var(--surface)]" />
      </div>
    );
  }

  if (lessonQuery.isError || !lesson) {
    return (
      <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--surface)] p-6">
        <h2 className="font-semibold">Unable to load lesson</h2>
      </div>
    );
  }

  const generatedSummary = createSummaryMutation.data?.summary;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-[var(--primary)]">
          <Sparkles size={16} />
          AI Summary
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {lesson.title}
        </h1>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Generate a summary from the whole lesson or selected topics.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div>
          <h2 className="font-semibold">Summary depth</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(
              [
                ['short', 'Short', 'Quick review'],
                ['medium', 'Medium', 'Balanced'],
                ['detailed', 'Detailed', 'Deep review'],
              ] as const
            ).map(([value, label, description]) => (
              <button
                key={value}
                type="button"
                onClick={() => setDepth(value)}
                className={`rounded-xl border p-4 text-left transition ${
                  depth === value
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                    : 'border-[var(--border)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <p className="font-medium">{label}</p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  {description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold">Summary scope</h2>

          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-4 hover:bg-[var(--surface-hover)]">
              <input
                type="radio"
                name="summary-scope"
                checked={scope === 'lesson'}
                onChange={() => setScope('lesson')}
              />

              <div>
                <p className="text-sm font-medium">Entire lesson</p>

                <p className="text-xs text-[var(--muted)]">
                  Summarize all topics.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-4 hover:bg-[var(--surface-hover)]">
              <input
                type="radio"
                name="summary-scope"
                checked={scope === 'selected'}
                onChange={() => setScope('selected')}
              />

              <div>
                <p className="text-sm font-medium">Selected topics</p>

                <p className="text-xs text-[var(--muted)]">
                  Choose exactly what AI should summarize.
                </p>
              </div>
            </label>
          </div>
        </div>

        {scope === 'selected' && (
          <div className="mt-5 space-y-2">
            {topics.map((topic: Topic) => {
              const selected = selectedTopicIds.includes(topic.id);

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => toggleTopic(topic.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                    selected
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                      : 'border-[var(--border)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <span className="text-sm font-medium">{topic.title}</span>

                  <span
                    className={`h-5 w-5 rounded-md border ${
                      selected
                        ? 'border-[var(--primary)] bg-[var(--primary)]'
                        : 'border-[var(--border)]'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}

        {createSummaryMutation.isError && (
          <div className="mt-5 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-4 py-3 text-sm text-[var(--danger)]">
            Unable to generate the summary. Please try again.
          </div>
        )}

        <button
          type="button"
          disabled={
            createSummaryMutation.isPending ||
            (scope === 'selected' && selectedTopicIds.length === 0)
          }
          onClick={handleGenerate}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles size={17} />

          {createSummaryMutation.isPending
            ? 'Generating...'
            : 'Generate Summary'}
        </button>
      </section>

      {generatedSummary && (
        <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[var(--primary)]" />

            <h2 className="font-semibold">Generated Summary</h2>
          </div>

          <div className="mt-6 whitespace-pre-wrap text-sm leading-7">
            {generatedSummary.content}
          </div>
        </section>
      )}
    </div>
  );
}