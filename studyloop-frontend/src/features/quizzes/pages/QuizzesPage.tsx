import {
  Brain,
  ChevronRight,
  Clock3,
  FileQuestion,
  Sparkles,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useLesson } from "../../lessons/hooks/useLessons";
import { useLessonQuizzes } from "../hooks/useQuizzes";
import type { Quiz } from "../types";

export function QuizzesPage() {
  const { containerId, lessonId } = useParams();

  const navigate = useNavigate();

  const lessonQuery = useLesson(containerId ?? "", lessonId ?? "");

  const quizzesQuery = useLessonQuizzes(containerId ?? "", lessonId ?? "");

  const lesson = lessonQuery.data;
  const quizzes = quizzesQuery.data?.quizzes ?? [];

  if (lessonQuery.isLoading || quizzesQuery.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Loading quizzes...</p>
      </div>
    );
  }

  if (lessonQuery.isError || quizzesQuery.isError || !lesson) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-[var(--danger)]">Failed to load quizzes.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Brain size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Quizzes</h1>

            <p className="text-sm text-[var(--muted)]">{lesson.title}</p>
          </div>
        </div>
      </div>

      {/* Empty */}
      {quizzes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <FileQuestion
            size={36}
            className="mx-auto mb-4 text-[var(--muted)]"
          />

          <h2 className="font-semibold">No quizzes yet</h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Generate your first quiz for this lesson.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz: Quiz) => (
            <button
              key={quiz.id}
              type="button"
              onClick={() =>
                navigate(
                  `/containers/${containerId}/lessons/${lessonId}/quiz/${quiz.id}`,
                )
              }
              className="group w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition hover:border-[var(--primary)] hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-5">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                      {quiz.difficulty}
                    </span>

                    <span className="rounded-full bg-[var(--surface-hover)] px-3 py-1 text-xs text-[var(--muted)]">
                      {quiz.format.replace("_", " ")}
                    </span>

                    <span className="rounded-full bg-[var(--surface-hover)] px-3 py-1 text-xs text-[var(--muted)]">
                      {quiz.scope.replace("_", " ")}
                    </span>
                  </div>

                  <h2 className="truncate font-semibold">
                    {quiz.questionCount} Question
                    {quiz.questionCount !== 1 ? "s" : ""}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
                    <span className="flex items-center gap-1.5">
                      <FileQuestion size={14} />
                      {quiz.questions?.length ?? 0} questions
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />

                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  className="shrink-0 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--primary)]"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Generate */}
      <button
        type="button"
        onClick={() =>
          navigate(`/containers/${containerId}/lessons/${lessonId}/quiz`)
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-medium transition hover:bg-[var(--surface-hover)]"
      >
        <Sparkles size={17} />
        Generate New Quiz
      </button>
    </div>
  );
}
