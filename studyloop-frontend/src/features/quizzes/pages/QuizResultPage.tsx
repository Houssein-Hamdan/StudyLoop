import type { ReactNode } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { Quiz, QuizResult } from "../types";

type QuizResultLocationState = {
  results: QuizResult;
  quiz: Quiz;
};

export function QuizResultPage() {
  const { containerId, lessonId, quizId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as QuizResultLocationState | null;

  if (!state?.results) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--warning)]/10 text-[var(--warning)]">
            <Trophy size={22} />
          </div>

          <h1 className="mt-5 text-xl font-semibold">Quiz result not found</h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            The result is available after submitting the quiz.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                containerId && lessonId && quizId
                  ? `/containers/${containerId}/lessons/${lessonId}/quiz/${quizId}`
                  : "/library",
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)]"
          >
            <ArrowLeft size={17} />
            Back to Quiz
          </button>
        </div>
      </div>
    );
  }

  const { totalQuestions, correctAnswers, score, percentage } = state.results;

  const incorrectAnswers = totalQuestions - correctAnswers;

  function retryQuiz() {
    if (!containerId || !lessonId || !quizId) {
      return;
    }

    navigate(`/containers/${containerId}/lessons/${lessonId}/quiz/${quizId}`);
  }

  function goToLesson() {
    if (!containerId || !lessonId) {
      return;
    }

    navigate(`/containers/${containerId}/lessons/${lessonId}`);
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}

      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
          <Trophy size={30} />
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight">
          Quiz Completed
        </h1>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Here is your quiz performance.
        </p>
      </div>

      {/* Main score */}

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="text-center">
          <p className="text-sm text-[var(--muted)]">Your Score</p>

          <div className="mt-2 text-6xl font-bold tracking-tight">{score}</div>

          <p className="mt-2 text-sm font-medium text-[var(--primary)]">
            {percentage}
          </p>
        </div>

        {/* Stats */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ResultStat
            label="Correct"
            value={correctAnswers}
            icon={<CheckCircle2 size={19} />}
          />

          <ResultStat
            label="Incorrect"
            value={incorrectAnswers}
            icon={<XCircle size={19} />}
          />

          <ResultStat
            label="Questions"
            value={totalQuestions}
            icon={<Trophy size={19} />}
          />
        </div>
      </section>

      {/* Performance */}

      <section className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <h2 className="text-lg font-semibold">
          {score >= 80
            ? "Excellent work!"
            : score >= 60
              ? "Good progress!"
              : "Keep practicing!"}
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Review the lesson and try the quiz again to strengthen your
          understanding.
        </p>
      </section>

      {/* Actions */}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={goToLesson}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface-hover)]"
        >
          <ArrowLeft size={17} />
          Back to Lesson
        </button>

        <button
          type="button"
          onClick={retryQuiz}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
        >
          <RotateCcw size={17} />
          Retry Quiz
        </button>
      </div>
    </div>
  );
}

type ResultStatProps = {
  label: string;
  value: number;
  icon: ReactNode;
};

function ResultStat({ label, value, icon }: ResultStatProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 text-center">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
        {icon}
      </div>

      <p className="mt-3 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
