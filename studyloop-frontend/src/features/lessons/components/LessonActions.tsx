import {
  Bot,
  FileText,
  HelpCircle,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

type LessonActionsProps = {
  containerId: string;
  lessonId: string;
};

export function LessonActions({
  containerId,
  lessonId,
}: LessonActionsProps) {
  const navigate = useNavigate();

  function goToSummary() {
    navigate(
      `/containers/${containerId}/lessons/${lessonId}/summary`,
    );
  }

  function goToQuiz() {
    navigate(
      `/containers/${containerId}/lessons/${lessonId}/quiz`,
    );
  }

  function goToAsk() {
    navigate(
      `/containers/${containerId}/lessons/${lessonId}/ask`,
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={goToSummary}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--surface-hover)]"
      >
        <FileText size={17} />
        Summary
      </button>

      <button
        type="button"
        onClick={goToQuiz}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--primary)]/40 hover:bg-[var(--surface-hover)]"
      >
        <HelpCircle size={17} />
        Generate Quiz
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