import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { CreateTopicRow } from "./CreateTopicRow";

type TopicForm = {
  id: string;
  title: string;
  description: string;
};

type StructuredLessonFormProps = {
  onSubmit: (payload: {
    title: string;
    topics: {
      title: string;
      description?: string;
    }[];
  }) => void;

  isSubmitting: boolean;
  error: unknown;
};

export function StructuredLessonForm({
  onSubmit,
  isSubmitting,
  error,
}: StructuredLessonFormProps) {
  const [title, setTitle] = useState("");

  const [topics, setTopics] = useState<TopicForm[]>([
    {
      id: crypto.randomUUID(),
      title: "",
      description: "",
    },
  ]);

  function addTopic() {
    setTopics((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
      },
    ]);
  }

  function removeTopic(id: string) {
    setTopics((current) => current.filter((topic) => topic.id !== id));
  }

  function updateTopic(
    id: string,
    field: "title" | "description",
    value: string,
  ) {
    setTopics((current) =>
      current.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              [field]: value,
            }
          : topic,
      ),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // التعديل المطلوب يقع هنا مباشرة:
    const cleanTopics = topics
      .filter((topic) => topic.title.trim())
      .map((topic) => ({
        title: topic.title.trim(),
        description: topic.description.trim() || undefined,
      }));

    if (!title.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      topics: cleanTopics,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Lesson title */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <label
          htmlFor="lesson-title"
          className="mb-2 block text-sm font-medium"
        >
          Lesson title
        </label>

        <input
          id="lesson-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Dependency Injection"
          disabled={isSubmitting}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
        />
      </div>

      {/* Topics */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Topics</h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Break the lesson into concepts you want to study and review.
            </p>
          </div>

          <button
            type="button"
            onClick={addTopic}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--surface-hover)]"
          >
            <Plus size={16} />
            Add topic
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {topics.map((topic, index) => (
            <div key={topic.id} className="flex gap-3">
              <div className="flex-1">
                <CreateTopicRow
                  index={index}
                  title={topic.title}
                  description={topic.description}
                  onTitleChange={(value) =>
                    updateTopic(topic.id, "title", value)
                  }
                  onDescriptionChange={(value) =>
                    updateTopic(topic.id, "description", value)
                  }
                />
              </div>

              {topics.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTopic(topic.id)}
                  disabled={isSubmitting}
                  className="mt-1 self-start rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                  title="Remove topic"
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
          {error instanceof Error ? error.message : "Failed to create lesson."}
        </div>
      ) : null}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating lesson..." : "Create Lesson"}
        </button>
      </div>
    </form>
  );
}