import {
  Edit3,
  FileText,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import { useState } from 'react';

import {
  useCreateAnnotation,
  useDeleteAnnotation,
  useUpdateAnnotation,
} from '../hooks/useAnnotations';

import type { Annotation } from '../types';

type AnnotationModalProps = {
  lessonId: string;
  topicId: string;
  topicTitle: string;
  annotations: Annotation[];
  onClose: () => void;
};

export default function AnnotationModal({
  lessonId,
  topicId,
  topicTitle,
  annotations,
  onClose,
}: AnnotationModalProps) {
  const createMutation = useCreateAnnotation(lessonId);
  const updateMutation = useUpdateAnnotation(lessonId);
  const deleteMutation = useDeleteAnnotation(lessonId);

  const [isCreating, setIsCreating] = useState(
    annotations.length === 0,
  );

  const [editingId, setEditingId] = useState<string | null>(null);

  const [content, setContent] = useState('');

  const [error, setError] = useState<string | null>(null);

  const topicAnnotations = annotations.filter(
    (annotation) =>
      annotation.topicId === topicId,
  );

  function startCreate() {
    setEditingId(null);
    setContent('');
    setError(null);
    setIsCreating(true);
  }

  function startEdit(annotation: Annotation) {
    setEditingId(annotation.id);
    setContent(annotation.content);
    setError(null);
    setIsCreating(false);
  }

  function cancelForm() {
    setEditingId(null);
    setContent('');
    setError(null);
    setIsCreating(false);
  }

  async function handleSubmit() {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError('Annotation cannot be empty.');
      return;
    }

    setError(null);

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          annotationId: editingId,
          payload: {
            content: trimmedContent,
          },
        });
      } else {
        await createMutation.mutateAsync({
          content: trimmedContent,
          topicId,
        });
      }

      cancelForm();
    } catch {
      setError(
        'Something went wrong. Please try again.',
      );
    }
  }

  async function handleDelete(annotationId: string) {
    const confirmed = window.confirm(
      'Delete this annotation?',
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(annotationId);

      if (editingId === annotationId) {
        cancelForm();
      }
    } catch {
      setError(
        'Unable to delete the annotation.',
      );
    }
  }

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 pb-16 sm:items-center sm:p-4 sm:pb-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[80vh] w-full flex-col overflow-hidden rounded-t-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl sm:max-w-xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FileText size={18} />

              <h2 className="font-semibold">
                Annotations
              </h2>
            </div>

            <p className="mt-1 truncate text-sm text-[var(--muted)]">
              {topicTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
            aria-label="Close annotations"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 pb-8 sm:pb-5">
          {topicAnnotations.length === 0 &&
          !isCreating ? (
            <div className="py-10 text-center">
              <FileText
                size={30}
                className="mx-auto text-[var(--muted)]"
              />

              <p className="mt-3 font-medium">
                No annotations yet
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Add your first note for this topic.
              </p>

              <button
                type="button"
                onClick={startCreate}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
              >
                <Plus size={16} />
                Add annotation
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {topicAnnotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  {editingId === annotation.id ? (
                    <AnnotationForm
                      content={content}
                      setContent={setContent}
                      error={error}
                      isSaving={isSaving}
                      onSubmit={handleSubmit}
                      onCancel={cancelForm}
                    />
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {annotation.content}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-xs text-[var(--muted)]">
                          {new Date(
                            annotation.updatedAt,
                          ).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              startEdit(annotation)
                            }
                            className="rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                            aria-label="Edit annotation"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(annotation.id)
                            }
                            disabled={
                              deleteMutation.isPending
                            }
                            className="rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-red-500/10 hover:text-[var(--danger)] disabled:opacity-50"
                            aria-label="Delete annotation"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {isCreating && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <AnnotationForm
                    content={content}
                    setContent={setContent}
                    error={error}
                    isSaving={isSaving}
                    onSubmit={handleSubmit}
                    onCancel={cancelForm}
                  />
                </div>
              )}

              {!isCreating && !editingId && (
                <button
                  type="button"
                  onClick={startCreate}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                >
                  <Plus size={16} />
                  Add annotation
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type AnnotationFormProps = {
  content: string;
  setContent: (value: string) => void;
  error: string | null;
  isSaving: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

function AnnotationForm({
  content,
  setContent,
  error,
  isSaving,
  onSubmit,
  onCancel,
}: AnnotationFormProps) {
  return (
    <div>
      <textarea
        value={content}
        onChange={(event) =>
          setContent(event.target.value)
        }
        placeholder="Write your annotation..."
        rows={4}
        autoFocus
        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
      />

      {error && (
        <p className="mt-2 text-xs text-[var(--danger)]">
          {error}
        </p>
      )}

      <div className="mt-3 flex justify-end gap-2 pb-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSaving}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}