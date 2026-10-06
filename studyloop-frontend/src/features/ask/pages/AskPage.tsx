import { useState } from "react";
import { useParams } from "react-router-dom";
import { Bot, Clock3, MessageCircle, Send, Trash2, User } from "lucide-react";
import { getApiErrorMessage } from "../../../lib/api/apiError";
import { useLesson } from "../../lessons/hooks/useLessons";
import {
  useAskQuestion,
  useDeleteQuestion,
  useLessonQuestions,
} from "../hooks/useAsk";

export function AskPage() {
  const { containerId, lessonId } = useParams();

  const [question, setQuestion] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  const lessonQuery = useLesson(containerId ?? "", lessonId ?? "");

  const questionsQuery = useLessonQuestions(containerId ?? "", lessonId ?? "");

  const askMutation = useAskQuestion(containerId ?? "", lessonId ?? "");

  const deleteMutation = useDeleteQuestion(containerId ?? "", lessonId ?? "");

  const lesson = lessonQuery.data;
  const questions = questionsQuery.data?.questions ?? [];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !containerId || !lessonId) {
      return;
    }

    askMutation.mutate(
      {
        questionText: trimmedQuestion,
        ...(selectedTopicId ? { topicId: selectedTopicId } : {}),
      },
      {
        onSuccess: () => {
          setQuestion("");
        },
      },
    );
  }

  function handleDelete(questionId: string) {
    deleteMutation.mutate(questionId);
  }

  if (lessonQuery.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[var(--muted)]">Loading lesson...</p>
      </div>
    );
  }

  if (lessonQuery.isError || !lesson) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[var(--danger)]">Failed to load lesson.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Bot size={20} />
          </div>

          <h1 className="text-2xl font-bold">Ask AI</h1>
        </div>

        <p className="text-sm text-[var(--muted)]">
          Ask anything about "{lesson.title}".
        </p>
      </div>

      {/* Ask form */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question about this lesson..."
            rows={5}
            className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm outline-none transition focus:border-[var(--primary)]"
          />

          {/* Topic selector */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Topic
              <span className="ml-1 font-normal text-[var(--muted)]">
                (optional)
              </span>
            </label>

            <select
              value={selectedTopicId}
              onChange={(event) => setSelectedTopicId(event.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
            >
              <option value="">Entire lesson</option>

              {lesson.topics.map((topic: { id: string; title: string }) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!question.trim() || askMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-medium text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
              {askMutation.isPending ? "Thinking..." : "Ask AI"}
            </button>
          </div>
        </form>

        {askMutation.isError && (
          <p className="mt-4 text-sm text-[var(--danger)]">
            {getApiErrorMessage(
              askMutation.error,
              "Something went wrong while asking AI.",
            )}
          </p>
        )}
      </section>

      {/* Questions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />

          <h2 className="text-lg font-semibold">Previous Questions</h2>

          <span className="rounded-full bg-[var(--surface-hover)] px-2.5 py-1 text-xs text-[var(--muted)]">
            {questions.length}
          </span>
        </div>

        {questionsQuery.isLoading ? (
          <div className="rounded-2xl border border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
            <MessageCircle
              size={32}
              className="mx-auto mb-3 text-[var(--muted)]"
            />

            <p className="font-medium">No questions yet</p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Ask your first question about this lesson.
            </p>
          </div>
        ) : (
          questions.map((item) => {
            const latestAnswer = item.answers?.[item.answers.length - 1];

            const topic = lesson.topics.find(
              (currentTopic: { id: string; title: string }) =>
                currentTopic.id === item.topicId,
            );

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                {/* Question */}
                <div className="border-b border-[var(--border)] p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User size={16} />
                      You
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--danger)]"
                      aria-label="Delete question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-sm leading-6">{item.questionText}</p>

                  {topic && (
                    <div className="mt-3 inline-flex rounded-full bg-[var(--surface-hover)] px-3 py-1 text-xs text-[var(--muted)]">
                      {topic.title}
                    </div>
                  )}
                </div>

                {/* AI Answer */}
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Bot size={16} />
                    StudyLoop AI
                  </div>

                  {latestAnswer ? (
                    <>
                      <div className="text-sm leading-7 text-[var(--foreground)]">
                        {latestAnswer.answerText
                          .split("\n")
                          .map((paragraph: string, index: number) => (
                            <p key={index} className="mb-3 last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]">
                        <Clock3 size={13} />
                        {new Date(latestAnswer.createdAt).toLocaleString()}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[var(--muted)]">
                      No answer available yet.
                    </p>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
