import { Bot } from "lucide-react";

import { useNavigate } from "react-router-dom";

type LessonActionsProps = {
  containerId: string;
  lessonId: string;
};

export function LessonActions({ containerId, lessonId }: LessonActionsProps) {
  const navigate = useNavigate();

  function goToAsk() {
    navigate(`/containers/${containerId}/lessons/${lessonId}/ask`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() =>
          navigate(`/containers/${containerId}/lessons/${lessonId}/quiz`)
        }
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--surface-hover)]"
      >
        Generate Quiz
      </button>

      <button
        onClick={() =>
          navigate(`/containers/${containerId}/lessons/${lessonId}/quizzes`)
        }
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--surface-hover)]"
      >
        View Quizzes
      </button>

      <button
        type="button"
        onClick={() =>
          navigate(`/containers/${containerId}/lessons/${lessonId}/summary`)
        }
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--surface-hover)]"
      >
        Generate Summary
      </button>

      <button
        type="button"
        onClick={() =>
          navigate(`/containers/${containerId}/lessons/${lessonId}/summaries`)
        }
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--surface-hover)]"
      >
        View Summaries
      </button>

      <button
        type="button"
        onClick={goToAsk}
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition hover:opacity-90"
      >
        <Bot size={17} />
        Ask AI
      </button>
    </div>
  );
}
