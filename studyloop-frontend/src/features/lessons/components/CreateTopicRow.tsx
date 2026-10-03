type CreateTopicRowProps = {
  index: number;
  title: string;
  description: string;

  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export function CreateTopicRow({
  index,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: CreateTopicRowProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)]/10 text-xs font-semibold text-[var(--primary)]">
          {index + 1}
        </span>

        <span className="text-xs font-medium text-[var(--muted)]">Topic</span>
      </div>

      <input
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="Topic title"
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
      />

      <textarea
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="mt-2 w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
      />
    </div>
  );
}
