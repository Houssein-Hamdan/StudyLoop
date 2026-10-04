import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Send,
  Sparkles,
} from "lucide-react";

import { useQuiz, useSubmitQuiz } from "../hooks/useQuizzes";

import type { QuizQuestion } from "../types";

export function QuizTakePage() {
  const { containerId, lessonId, quizId } = useParams();

  const navigate = useNavigate();

  const safeContainerId = containerId ?? "";
  const safeLessonId = lessonId ?? "";
  const safeQuizId = quizId ?? "";

  const quizQuery = useQuiz(safeContainerId, safeLessonId, safeQuizId);

  const submitMutation = useSubmitQuiz(safeContainerId, safeLessonId);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const quiz = quizQuery.data?.quiz;

  const questions = useMemo<QuizQuestion[]>(() => {
    return quiz?.questions ?? [];
  }, [quiz?.questions]);

  const currentQuestion = questions[currentIndex] ?? null;

  const currentAnswer = currentQuestion
    ? (answers[currentQuestion.id] ?? "")
    : "";

  const answeredCount = useMemo(() => {
    return questions.filter((question) => {
      return Boolean(answers[question.id]?.trim());
    }).length;
  }, [answers, questions]);

  const allAnswered =
    questions.length > 0 && answeredCount === questions.length;

  const isLastQuestion = currentIndex === questions.length - 1;

  const progressPercentage =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  function setAnswer(answer: string) {
    if (!currentQuestion) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: answer,
    }));
  }

  function goToPrevious() {
    setCurrentIndex((current) => Math.max(0, current - 1));
  }

  function goToNext() {
    if (!currentQuestion) {
      return;
    }

    setCurrentIndex((current) => Math.min(questions.length - 1, current + 1));
  }

  function goToQuestion(index: number) {
    if (index < 0 || index >= questions.length) {
      return;
    }

    setCurrentIndex(index);
  }

  function handleSubmit() {
    if (
      !safeContainerId ||
      !safeLessonId ||
      !safeQuizId ||
      !quiz ||
      !allAnswered ||
      submitMutation.isPending
    ) {
      return;
    }

    const formattedAnswers = questions.map((question) => ({
      questionId: question.id,
      userAnswer: answers[question.id]?.trim() ?? "",
    }));

    submitMutation.mutate(
      {
        quizId: safeQuizId,
        answers: formattedAnswers,
      },
      {
        onSuccess: (response) => {
          navigate(
            `/containers/${safeContainerId}/lessons/${safeLessonId}/quiz/${safeQuizId}/result`,
            {
              state: {
                results: response.results,
                quiz,
              },
            },
          );
        },
      },
    );
  }

  function goBackToLesson() {
    if (!safeContainerId || !safeLessonId) {
      navigate("/library");
      return;
    }

    navigate(`/containers/${safeContainerId}/lessons/${safeLessonId}`);
  }

  if (quizQuery.isLoading) {
    return <QuizLoadingState />;
  }

  if (quizQuery.isError || !quiz) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--surface)] p-6 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--danger)]/10 text-[var(--danger)]">
            <HelpCircle size={22} />
          </div>

          <h1 className="mt-5 text-xl font-semibold">Unable to load quiz</h1>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            The quiz could not be loaded. Please try again.
          </p>

          <button
            type="button"
            onClick={goBackToLesson}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-hover)]"
          >
            <ArrowLeft size={16} />
            Back to lesson
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--warning)]/10 text-[var(--warning)]">
            <HelpCircle size={22} />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            This quiz has no questions
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Generate a new quiz with at least one question.
          </p>

          <button
            type="button"
            onClick={goBackToLesson}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-hover)]"
          >
            <ArrowLeft size={16} />
            Back to lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-[var(--primary)]">
            <Sparkles size={16} />
            <span>AI Quiz</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {getQuizTitle(quiz.format)}
          </h1>

          <p className="mt-1 text-sm capitalize text-[var(--muted)]">
            {quiz.difficulty} · {questions.length}{" "}
            {questions.length === 1 ? "question" : "questions"}
          </p>
        </div>

        <div className="self-start rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm">
          <span className="text-[var(--muted)]">Answered</span>{" "}
          <span className="font-semibold">{answeredCount}</span>
          <span className="text-[var(--muted)]"> / {questions.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>

          <span>{Math.round(progressPercentage)}%</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-sm font-bold text-[var(--primary)]">
            {currentIndex + 1}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold leading-7 sm:text-xl sm:leading-8">
              {currentQuestion.questionText}
            </p>
          </div>
        </div>

        <div className="mt-7 sm:mt-8">
          <QuestionInput
            question={currentQuestion}
            value={currentAnswer}
            onChange={setAnswer}
          />
        </div>
      </section>

      {/* Submit Error */}
      {submitMutation.isError && (
        <div className="mt-5 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-4 py-3 text-sm leading-6 text-[var(--danger)]">
          Unable to submit the quiz. Please try again.
        </div>
      )}

      {/* Navigation */}
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={17} />
          Previous
        </button>

        <div className="flex w-full gap-3 sm:w-auto">
          {!isLastQuestion ? (
            <button
              type="button"
              onClick={goToNext}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 sm:flex-none"
            >
              Next
              <ArrowRight size={17} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered || submitMutation.isPending}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <Send size={17} />

              {submitMutation.isPending ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>

      {/* Missing answers message */}
      {isLastQuestion && !allAnswered && !submitMutation.isPending && (
        <p className="mt-3 text-center text-xs text-[var(--muted)]">
          Answer all questions before submitting the quiz.
        </p>
      )}

      {/* Question Navigator */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Questions</p>

          <p className="text-xs text-[var(--muted)]">
            {answeredCount}/{questions.length}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {questions.map((question, index) => {
            const answered = Boolean(answers[question.id]?.trim());

            const active = index === currentIndex;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => goToQuestion(index)}
                aria-label={`Go to question ${index + 1}`}
                aria-current={active ? "step" : undefined}
                className={`
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-lg
                  text-xs font-semibold
                  transition
                  ${
                    active
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : answered
                        ? "bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20"
                        : "bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }
                `}
              >
                {answered ? <CheckCircle2 size={16} /> : index + 1}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function getQuizTitle(format: QuizQuestion["format"]) {
  switch (format) {
    case "multiple_choice":
      return "Multiple Choice Quiz";

    case "true_false":
      return "True / False Quiz";

    case "open_text":
      return "Open Text Quiz";

    case "fill_blanks":
      return "Fill in the Blanks";

    default:
      return "AI Quiz";
  }
}

type QuestionInputProps = {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
};

function QuestionInput({ question, value, onChange }: QuestionInputProps) {
  if (question.format === "multiple_choice") {
    return (
      <div className="space-y-3">
        {(question.options ?? []).map((option, index) => {
          const selected = value === option;

          return (
            <button
              key={`${option}-${index}`}
              type="button"
              onClick={() => onChange(option)}
              className={`
                  flex min-h-12 w-full
                  items-center gap-3
                  rounded-xl border
                  p-3 text-left
                  transition
                  sm:gap-4 sm:p-4
                  ${
                    selected
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
                  }
                `}
            >
              <div
                className={`
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-lg
                    text-sm font-semibold
                    ${
                      selected
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--surface-hover)] text-[var(--muted)]"
                    }
                  `}
              >
                {String.fromCharCode(65 + index)}
              </div>

              <span className="min-w-0 text-sm leading-6">{option}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.format === "true_false") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {["true", "false"].map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`
                min-h-14 rounded-xl border
                p-4 text-center
                text-sm font-semibold
                capitalize transition
                ${
                  selected
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={6}
      placeholder={
        question.format === "fill_blanks"
          ? "Complete the answer..."
          : "Write your answer..."
      }
      className="
        w-full resize-y
        rounded-xl
        border border-[var(--border)]
        bg-[var(--background)]
        px-4 py-3
        text-base leading-7
        outline-none transition
        placeholder:text-[var(--muted)]
        focus:border-[var(--primary)]
        focus:ring-2
        focus:ring-[var(--primary)]/10
        sm:text-sm
      "
    />
  );
}

function QuizLoadingState() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="h-5 w-24 animate-pulse rounded bg-[var(--surface-hover)]" />

      <div className="mt-3 h-9 w-72 animate-pulse rounded bg-[var(--surface-hover)]" />

      <div className="mt-3 h-4 w-48 animate-pulse rounded bg-[var(--surface-hover)]" />

      <div className="mt-6 h-2 w-full animate-pulse rounded-full bg-[var(--surface-hover)]" />

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="flex gap-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[var(--surface-hover)]" />

          <div className="h-16 w-full animate-pulse rounded-xl bg-[var(--surface-hover)]" />
        </div>

        <div className="mt-8 space-y-3">
          <div className="h-14 w-full animate-pulse rounded-xl bg-[var(--surface-hover)]" />
          <div className="h-14 w-full animate-pulse rounded-xl bg-[var(--surface-hover)]" />
          <div className="h-14 w-full animate-pulse rounded-xl bg-[var(--surface-hover)]" />
        </div>
      </div>
    </div>
  );
}
