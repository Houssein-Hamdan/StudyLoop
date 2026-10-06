import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Check, HelpCircle, Shuffle, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { getApiErrorMessage } from "../../../lib/api/apiError";
import { useLesson } from "../../lessons/hooks/useLessons";
import { useCreateQuiz } from "../hooks/useQuizzes";

import type { QuizDifficulty, QuizFormat, QuizScope } from "../types";
import type { Topic } from "../../lessons/types";

export function QuizPage() {
  const { containerId, lessonId } = useParams();

  const navigate = useNavigate();

  const [scope, setScope] = useState<QuizScope>("full_lesson");

  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium");

  const [format, setFormat] = useState<QuizFormat>("multiple_choice");

  const [questionCount, setQuestionCount] = useState(5);

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  const lessonQuery = useLesson(containerId ?? "", lessonId ?? "");

  const createQuizMutation = useCreateQuiz(containerId ?? "", lessonId ?? "");

  const lesson = lessonQuery.data;

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

    if (scope === "selected_topics" && selectedTopicIds.length === 0) {
      return;
    }

    createQuizMutation.mutate(
      {
        scope,

        ...(scope === "selected_topics"
          ? {
              selectedTopicIds,
            }
          : {}),

        difficulty,
        format,
        questionCount,
      },
      {
        onSuccess: (response) => {
          navigate(
            `/containers/${containerId}/lessons/${lessonId}/quiz/${response.quiz.id}`,
          );
        },
      },
    );
  }

  if (lessonQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="h-10 w-72 animate-pulse rounded bg-[var(--surface-hover)]" />

        <div className="mt-6 h-96 animate-pulse rounded-2xl bg-[var(--surface)]" />
      </div>
    );
  }

  if (lessonQuery.isError || !lesson) {
    return (
      <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--surface)] p-6">
        <h2 className="font-semibold">Unable to load lesson</h2>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}

      <div>
        <div className="flex items-center gap-2 text-sm text-[var(--primary)]">
          <Sparkles size={16} />

          <span>AI Quiz</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Generate Quiz
        </h1>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Configure a quiz for "{lesson.title}".
        </p>
      </div>

      {/* Scope */}

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-start gap-3">
          <HelpCircle size={20} className="mt-0.5 text-[var(--primary)]" />

          <div>
            <h2 className="font-semibold">Quiz scope</h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Decide what the quiz should cover.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <OptionCard
            selected={scope === "full_lesson"}
            onClick={() => setScope("full_lesson")}
            title="Entire lesson"
            description="Use all topics"
          />

          <OptionCard
            selected={scope === "selected_topics"}
            onClick={() => setScope("selected_topics")}
            title="Selected topics"
            description="Choose specific topics"
          />

          <OptionCard
            selected={scope === "random"}
            onClick={() => setScope("random")}
            title="Random"
            description="Let AI choose"
            icon={<Shuffle size={17} />}
          />
        </div>

        {scope === "selected_topics" && (
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
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{topic.title}</p>

                    {topic.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-[var(--muted)]">
                        {topic.description}
                      </p>
                    )}
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      selected
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {selected && <Check size={13} />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Difficulty */}

      <section className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="font-semibold">Difficulty</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <OptionCard
            selected={difficulty === "easy"}
            onClick={() => setDifficulty("easy")}
            title="Easy"
            description="Fundamentals"
          />

          <OptionCard
            selected={difficulty === "medium"}
            onClick={() => setDifficulty("medium")}
            title="Medium"
            description="Understanding"
          />

          <OptionCard
            selected={difficulty === "hard"}
            onClick={() => setDifficulty("hard")}
            title="Hard"
            description="Deep thinking"
          />
        </div>
      </section>

      {/* Format */}

      <section className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="font-semibold">Question format</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <OptionCard
            selected={format === "multiple_choice"}
            onClick={() => setFormat("multiple_choice")}
            title="Multiple Choice"
            description="Choose one answer"
          />

          <OptionCard
            selected={format === "open_text"}
            onClick={() => setFormat("open_text")}
            title="Open Text"
            description="Write your answer"
          />

          <OptionCard
            selected={format === "fill_blanks"}
            onClick={() => setFormat("fill_blanks")}
            title="Fill Blanks"
            description="Complete the sentence"
          />

          <OptionCard
            selected={format === "true_false"}
            onClick={() => setFormat("true_false")}
            title="True / False"
            description="Choose true or false"
          />
        </div>
      </section>

      {/* Question count */}

      <section className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Number of questions</h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Choose between 1 and 50 questions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={questionCount <= 1}
              onClick={() =>
                setQuestionCount((current) => Math.max(1, current - 1))
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              -
            </button>

            <span className="w-8 text-center text-lg font-semibold">
              {questionCount}
            </span>

            <button
              type="button"
              disabled={questionCount >= 50}
              onClick={() =>
                setQuestionCount((current) => Math.min(50, current + 1))
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      </section>

      {/* Error */}

      {createQuizMutation.isError && (
        <div className="mt-5 rounded-xl border border-[var(--danger)]/30 bg-[var(--surface)]/5 px-4 py-3 text-sm text-[var(--danger)]">
          {getApiErrorMessage(
            createQuizMutation.error,
            "Unable to generate the quiz. Please try again.",
          )}
        </div>
      )}

      {/* Generate */}

      <button
        type="button"
        disabled={
          createQuizMutation.isPending ||
          (scope === "selected_topics" && selectedTopicIds.length === 0)
        }
        onClick={handleGenerate}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Sparkles size={18} />

        {createQuizMutation.isPending ? "Generating Quiz..." : "Generate Quiz"}
      </button>
    </div>
  );
}

type OptionCardProps = {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon?: ReactNode;
};

function OptionCard({
  selected,
  onClick,
  title,
  description,
  icon,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[var(--primary)] bg-[var(--primary)]/10"
          : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{title}</p>

        {icon && <span className="text-[var(--primary)]">{icon}</span>}
      </div>

      <p className="mt-1 text-xs text-[var(--muted)]">{description}</p>
    </button>
  );
}
