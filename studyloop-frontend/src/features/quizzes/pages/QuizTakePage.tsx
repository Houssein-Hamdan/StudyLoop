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

  const quizQuery = useQuiz(containerId ?? "", lessonId ?? "", quizId ?? "");

  const submitMutation = useSubmitQuiz(
    containerId ?? "",
    lessonId ?? "",
    quizId ?? "",
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const quiz = quizQuery.data?.quiz;

  // حفظ مرجع الأسئلة لمنع إعادة الحساب غير الضرورية
  const questions = useMemo<QuizQuestion[]>(() => {
    return quiz?.questions ?? [];
  }, [quiz?.questions]);

  const currentQuestion = questions[currentIndex] ?? null;

  const currentAnswer = currentQuestion
    ? (answers[currentQuestion.id] ?? "")
    : "";

  const answeredCount = useMemo(() => {
    return questions.filter((question) => answers[question.id]?.trim()).length;
  }, [answers, questions]);

  const allAnswered =
    questions.length > 0 && answeredCount === questions.length;

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
    setCurrentIndex((current) => Math.min(questions.length - 1, current + 1));
  }

  function handleSubmit() {
    if (!containerId || !lessonId || !quizId || !allAnswered) {
      return;
    }

    submitMutation.mutate(
      {
        quizId,
        answers: questions.map((question) => ({
          questionId: question.id,
          userAnswer: answers[question.id].trim(),
        })),
      },
      {
        onSuccess: (response) => {
          navigate(
            `/containers/${containerId}/lessons/${lessonId}/quiz/${quizId}/result`,
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
    if (!containerId || !lessonId) {
      return;
    }

    navigate(`/containers/${containerId}/lessons/${lessonId}`);
  }

  if (quizQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="h-8 w-56 animate-pulse rounded bg-[var(--surface-hover)]" />
        <div className="mt-6 h-4 w-full animate-pulse rounded bg-[var(--surface-hover)]" />
        <div className="mt-6 h-[420px] animate-pulse rounded-2xl bg-[var(--surface)]" />
      </div>
    );
  }

  if (quizQuery.isError || !quiz) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--surface)] p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--danger)]/10 text-[var(--danger)]">
            <HelpCircle size={22} />
          </div>

          <h1 className="mt-5 text-xl font-semibold">Unable to load quiz</h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            The quiz could not be loaded. Please try again.
          </p>

          <button
            type="button"
            onClick={goBackToLesson}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-hover)]"
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
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <h1 className="text-xl font-semibold">This quiz has no questions</h1>

          <button
            type="button"
            onClick={goBackToLesson}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to lesson
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--primary)]">
            <Sparkles size={16} />
            <span>AI Quiz</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {quiz.format === "multiple_choice"
              ? "Multiple Choice Quiz"
              : quiz.format === "true_false"
                ? "True / False Quiz"
                : quiz.format === "open_text"
                  ? "Open Text Quiz"
                  : "Fill Blanks Quiz"}
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {quiz.difficulty} · {questions.length} questions
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm">
          <span className="text-[var(--muted)]">Answered</span>{" "}
          <span className="font-semibold">{answeredCount}</span>
          <span className="text-[var(--muted)]"> / {questions.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-sm font-bold text-[var(--primary)]">
            {currentIndex + 1}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold leading-8 sm:text-xl">
              {currentQuestion.questionText}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <QuestionInput
            question={currentQuestion}
            value={currentAnswer}
            onChange={setAnswer}
          />
        </div>
      </section>

      {/* Submit Error */}
      {submitMutation.isError && (
        <div className="mt-5 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-4 py-3 text-sm text-[var(--danger)]">
          Unable to submit the quiz. Please try again.
        </div>
      )}

      {/* Navigation */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={17} />
          Previous
        </button>

        <div className="flex gap-3">
          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={goToNext}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 sm:flex-none"
            >
              Next
              <ArrowRight size={17} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered || submitMutation.isPending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <Send size={17} />
              {submitMutation.isPending ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>

      {/* Navigator */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-sm font-semibold">Questions</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {questions.map((question, index) => {
            const answered = Boolean(answers[question.id]?.trim());
            const active = index === currentIndex;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition ${
                  active
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : answered
                      ? "bg-[var(--success)]/10 text-[var(--success)]"
                      : "bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {answered ? <CheckCircle2 size={15} /> : index + 1}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
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
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                  : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                  selected
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--surface-hover)] text-[var(--muted)]"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>

              <span className="text-sm leading-6">{option}</span>
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
              className={`rounded-xl border p-5 text-center text-sm font-semibold capitalize transition ${
                selected
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
              }`}
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
      className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
    />
  );
}
