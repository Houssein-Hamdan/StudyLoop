import { useState } from "react";
import { BookOpen, ChevronRight, Pencil, Trash2, X, Check } from "lucide-react";
import { Link } from "react-router-dom";

import type { Container } from "../types";
import { useUpdateContainer, useDeleteContainer } from "../hooks/useContainers";
import { ConfirmDeleteModal } from "../../lessons/components/ConfirmDeleteModal"; 

type ContainerCardProps = {
  container: Container;
};

export function ContainerCard({ container }: ContainerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState(container.name);
  const [description, setDescription] = useState(container.description || "");

  const updateContainerMutation = useUpdateContainer();
  const deleteContainerMutation = useDeleteContainer();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!name.trim()) return;

    updateContainerMutation.mutate(
      {
        containerId: container.id,
        payload: { name: name.trim(), description: description.trim() },
      },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const handleDeleteConfirm = () => {
    deleteContainerMutation.mutate(container.id, {
      onSuccess: () => setIsDeleting(false),
    });
  };

  return (
    <>
      <div className="group relative block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-lg sm:p-5">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Edit Container</h4>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X size={16} />
              </button>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Container Name"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-sm outline-none focus:border-[var(--primary)]"
              required
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-xs outline-none focus:border-[var(--primary)] resize-none"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg px-2.5 py-1 text-xs text-[var(--muted)] hover:bg-[var(--surface-hover)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateContainerMutation.isPending}
                className="flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                <Check size={12} />
                {updateContainerMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <Link to={`/containers/${container.id}`} className="block">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] sm:h-11 sm:w-11">
                  <BookOpen size={20} />
                </div>

                <h3 className="truncate font-semibold text-base sm:text-lg">
                  {container.name}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Edit Container"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition"
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  title="Delete Container"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDeleting(true);
                  }}
                  className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 transition"
                >
                  <Trash2 size={15} />
                </button>

                <ChevronRight
                  size={18}
                  className="shrink-0 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--foreground)] ml-1"
                />
              </div>
            </div>

            <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2 sm:mt-3 sm:text-sm">
              {container.description || "No description yet."}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs sm:mt-5 sm:pt-4">
              <span className="text-[var(--muted)]">
                Created {new Date(container.createdAt).toLocaleDateString()}
              </span>

              <span className="font-medium text-[var(--primary)] text-xs sm:text-sm">
                Open
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Modal الحذف المخصص */}
      <ConfirmDeleteModal
        isOpen={isDeleting}
        title="Delete Container"
        itemName={container.name}
        isLoading={deleteContainerMutation.isPending}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}