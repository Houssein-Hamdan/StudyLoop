import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";

import { useParseRawContent } from "../hooks/useLessons";

type ParsedTopic = {
  title: string;
  description?: string;
  order: number;
};

type PasteLessonFormProps = {
  containerId: string;

  onSubmit: (payload: {
    title: string;
    rawContent: string;
    topics?: ParsedTopic[];
  }) => void;

  isSubmitting: boolean;
  error: unknown;
};

const PLACEHOLDER_TEXT = `Paste your notes here...
Example:
Dependency Injection
What is Dependency Injection?
Why do we use it?
Dependency Inversion Principle
High-level modules should not depend directly on low-level modules.`;

export function PasteLessonForm({
  containerId,
  onSubmit,
  isSubmitting,
  error,
}: PasteLessonFormProps) {
  const parseMutation = useParseRawContent();

  const [title, setTitle] = useState("");
  const [rawContent, setRawContent] = useState("");

  const [parsedTopics, setParsedTopics] = useState<ParsedTopic[]>([]);

  async function handleParse() {
    if (!rawContent.trim()) {
      return;
    }

    try {
      const response = await parseMutation.mutateAsync({
        containerId,
        rawContent: rawContent.trim(),
      });

      const topics = response?.topics ?? response?.data?.topics ?? [];

      if (Array.isArray(topics)) {
        setParsedTopics(topics);
      }
    } catch {
      // Error shown below.
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !rawContent.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      rawContent: rawContent.trim(),
      ...(parsedTopics.length > 0
        ? {
            topics: parsedTopics,
          }
        : {}),
    });
  }

  const isParsing = parseMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <label
          htmlFor="paste-lesson-title"
          className="mb-2 block text-sm font-medium"
        >
          Lesson title
        </label>

        <input
          id="paste-lesson-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Clean Architecture"
          disabled={isSubmitting}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
        />
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <FileText size={20} />
          </div>

          <div>
            <h2 className="font-semibold">Paste your content</h2>

            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Paste your notes and let StudyLoop structure them into topics.
            </p>
          </div>
        </div>

        <textarea
          value={rawContent}
          onChange={(event) => setRawContent(event.target.value)}
          placeholder={PLACEHOLDER_TEXT}
          rows={14}
          disabled={isSubmitting}
          className="mt-5 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 outline-none placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
        />

        {/* Parse */}
        <button
          type="button"
          onClick={handleParse}
          disabled={isParsing || !rawContent.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles size={17} />

          {isParsing ? "Analyzing..." : "Analyze Content"}
        </button>

        {/* Parse error */}
        {parseMutation.isError && (
          <div className="mt-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
            {parseMutation.error instanceof Error
              ? parseMutation.error.message
              : "Failed to analyze content."}
          </div>
        )}
      </div>

      {/* Parsed topics */}
      {parsedTopics.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Detected Topics</h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                StudyLoop detected {parsedTopics.length} topics.
              </p>
            </div>

            <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              {parsedTopics.length}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {parsedTopics.map((topic) => (
              <div
                key={`${topic.order}-${topic.title}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
              >
                <p className="font-medium">{topic.title}</p>

                {topic.description && (
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    {topic.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create error */}
      {error ? (
        <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
          {error instanceof Error ? error.message : "Failed to create lesson."}
        </div>
      ) : null}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !rawContent.trim()}
          className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating lesson..." : "Create Lesson"}
        </button>
      </div>
    </form>
  );
}