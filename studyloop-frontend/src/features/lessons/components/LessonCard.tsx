import { useState } from "react";
import { BookOpen, ChevronRight, Pencil, Trash2, X, Check } from "lucide-react";
import { Link } from "react-router-dom";

import type { Lesson } from "../types";
import { useUpdateLesson, useDeleteLesson } from "../hooks/useLessons";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";

type LessonCardProps = {
  lesson: Lesson;
  containerId: string;
};

export function LessonCard({ lesson, containerId }: LessonCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(lesson.title);

  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();

  const topicsCount = lesson.topics?.length ?? 0;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title.trim()) return;

    updateLessonMutation.mutate(
      {
        containerId,
        lessonId: lesson.id,
        payload: { title: title.trim() },
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleDeleteConfirm = () => {
    deleteLessonMutation.mutate(
      {
        containerId,
        lessonId: lesson.id,
      },
      {
        onSuccess: () => setIsDeleting(false),
      },
    );
  };

  return (
    <>
      <div className="group relative block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-lg">
        {isEditing ? (
          <form
            onSubmit={handleUpdate}
            className="space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Edit Lesson</h4>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson Title"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-sm outline-none focus:border-[var(--primary)]"
              required
              autoFocus
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
                disabled={updateLessonMutation.isPending}
                className="flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                <Check size={12} />
                {updateLessonMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <Link
            to={`/containers/${containerId}/lessons/${lesson.id}`}
            className="block"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <BookOpen size={21} />
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Edit Lesson"
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
                  title="Delete Lesson"
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
                  className="ml-1 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--foreground)]"
                />
              </div>
            </div>

            <h3 className="mt-5 line-clamp-2 text-lg font-semibold">
              {lesson.title}
            </h3>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
              <span className="text-sm text-[var(--muted)]">
                {topicsCount} {topicsCount === 1 ? "topic" : "topics"}
              </span>

              <span className="text-sm font-medium text-[var(--primary)]">
                Open
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Modal الحذف المخصص */}
      <ConfirmDeleteModal
        isOpen={isDeleting}
        title="Delete Lesson"
        itemName={lesson.title}
        isLoading={deleteLessonMutation.isPending}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
