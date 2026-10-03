import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";

type EditTopicModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  title: string;
  description: string | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
  }) => void;
};

export function EditTopicModal({
  isOpen,
  isSubmitting,
  title: initialTitle,
  description: initialDescription,
  onClose,
  onSubmit,
}: EditTopicModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(
    initialDescription ?? "",
  );

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription ?? "");
    }
  }, [
    isOpen,
    initialTitle,
    initialDescription,
  ]);

  if (!isOpen) return null;

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="font-semibold">
              Edit Topic
            </h2>

            <p className="mt-1 text-xs text-[var(--muted)]">
              Update this topic.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)]"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Title
            </label>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface-hover)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting || !title.trim()
              }
              className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}