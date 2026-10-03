import { FileText, ListTree } from 'lucide-react';
import type { CreateLessonMode } from '../types';

type Props = {
  mode: CreateLessonMode;
  onChange: (mode: CreateLessonMode) => void;
};

export function CreateLessonModeSelector({
  mode,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange('structured')}
        className={`rounded-xl border p-4 text-left transition ${
          mode === 'structured'
            ? 'border-[var(--primary)] bg-[var(--primary)]/10'
            : 'border-[var(--border)] hover:bg-[var(--surface-hover)]'
        }`}
      >
        <ListTree
          size={20}
          className="mb-3 text-[var(--primary)]"
        />

        <p className="font-semibold">Structured</p>

        <p className="mt-1 text-xs text-[var(--muted)]">
          Create topics manually.
        </p>
      </button>

      <button
        type="button"
        onClick={() => onChange('paste')}
        className={`rounded-xl border p-4 text-left transition ${
          mode === 'paste'
            ? 'border-[var(--primary)] bg-[var(--primary)]/10'
            : 'border-[var(--border)] hover:bg-[var(--surface-hover)]'
        }`}
      >
        <FileText
          size={20}
          className="mb-3 text-[var(--primary)]"
        />

        <p className="font-semibold">Paste Content</p>

        <p className="mt-1 text-xs text-[var(--muted)]">
          Paste content and parse it automatically.
        </p>
      </button>
    </div>
  );
}