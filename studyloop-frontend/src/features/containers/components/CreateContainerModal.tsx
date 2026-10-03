import { useState } from 'react';
import { X } from 'lucide-react';

import { useCreateContainer } from '../hooks/useContainers';

type CreateContainerModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateContainerModal({
  open,
  onClose,
}: CreateContainerModalProps) {
  const createContainerMutation = useCreateContainer();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!open) {
    return null;
  }

  function handleClose() {
    if (createContainerMutation.isPending) {
      return;
    }

    setName('');
    setDescription('');
    onClose();
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      return;
    }

    try {
      await createContainerMutation.mutateAsync({
        name: trimmedName,
        ...(trimmedDescription
          ? { description: trimmedDescription }
          : {}),
      });

      setName('');
      setDescription('');
      onClose();
    } catch {
      // The mutation error is displayed below.
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
          <div>
            <h2 className="text-lg font-semibold">
              Create Container
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Create a space for your lessons.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={createContainerMutation.isPending}
            className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {/* Name */}
          <div>
            <label
              htmlFor="container-name"
              className="mb-2 block text-sm font-medium"
            >
              Name
            </label>

            <input
              id="container-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Software Engineering"
              disabled={createContainerMutation.isPending}
              autoFocus
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="container-description"
              className="mb-2 block text-sm font-medium"
            >
              Description
              <span className="ml-1 text-[var(--muted)]">
                (optional)
              </span>
            </label>

            <textarea
              id="container-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="What are you learning here?"
              rows={3}
              disabled={createContainerMutation.isPending}
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
            />
          </div>

          {/* Error */}
          {createContainerMutation.isError && (
            <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
              {createContainerMutation.error instanceof Error
                ? createContainerMutation.error.message
                : 'Failed to create container.'}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={createContainerMutation.isPending}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !name.trim() ||
                createContainerMutation.isPending
              }
              className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createContainerMutation.isPending
                ? 'Creating...'
                : 'Create Container'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}