import { BookOpen, Plus } from 'lucide-react';

type EmptyContainersProps = {
  onCreate: () => void;
};

export function EmptyContainers({
  onCreate,
}: EmptyContainersProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
        <BookOpen size={28} />
      </div>

      <h2 className="mt-5 text-xl font-semibold">
        Your library is empty
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
        Create your first container to start organizing your
        lessons and knowledge.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
      >
        <Plus size={18} />
        Create Container
      </button>
    </div>
  );
}