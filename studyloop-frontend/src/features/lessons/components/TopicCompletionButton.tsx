import { CheckCircle2, Circle } from "lucide-react";

type TopicCompletionButtonProps = {
  completed: boolean;
  isPending: boolean;
  onToggle: () => void;
};

export function TopicCompletionButton({
  completed,
  isPending,
  onToggle,
}: TopicCompletionButtonProps) {
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
        completed
          ? "bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20"
          : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
      }`}
    >
      {completed ? <CheckCircle2 size={17} /> : <Circle size={17} />}

      {isPending ? "Saving..." : completed ? "Completed" : "Mark as complete"}
    </button>
  );
}
