import { ArrowLeft, BookOpen, Plus } from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { useContainer } from "../hooks/useContainers";
import { useLessons } from "../../lessons/hooks/useLessons";

import { LessonList } from "../../lessons/components/LessonList";
import { EmptyLessons } from "../../lessons/components/EmptyLessons";

export function ContainerPage() {
  const { containerId } = useParams();

  const {
    data: container,
    isLoading: isContainerLoading,
    isError: isContainerError,
  } = useContainer(containerId ?? "");

  const {
    data: lessons,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
  } = useLessons(containerId ?? "");

  if (!containerId) {
    return (
      <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-6 text-[var(--danger)]">
        Container ID is missing.
      </div>
    );
  }

  if (isContainerLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--surface)]" />

        <div className="h-52 animate-pulse rounded-2xl bg-[var(--surface)]" />

        <div className="h-10 w-40 animate-pulse rounded bg-[var(--surface)]" />
      </div>
    );
  }

  if (isContainerError || !container) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <Link
          to="/library"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={16} />
          Back to Library
        </Link>

        <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-6">
          <h2 className="font-semibold text-[var(--danger)]">
            Failed to load container
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            The container could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const lessonList = Array.isArray(lessons) ? lessons : [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Back */}
      <Link
        to="/library"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={16} />
        Back to Library
      </Link>

      {/* Container Header */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <BookOpen size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">{container.name}</h1>

              {container.description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                  {container.description}
                </p>
              )}
            </div>
          </div>

          <Link
            to={`/containers/${containerId}/lessons/new`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            <Plus size={18} />
            New Lesson
          </Link>
        </div>

        {/* Container stats */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="text-xs text-[var(--muted)]">Lessons</p>

            <p className="mt-1 text-xl font-bold">{lessonList.length}</p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="text-xs text-[var(--muted)]">Created</p>

            <p className="mt-1 text-xl font-bold">
              {new Date(container.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Lessons</h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Build and review the knowledge inside this container.
            </p>
          </div>

          {lessonList.length > 0 && (
            <Link
              to={`/containers/${containerId}/lessons/new`}
              className="hidden items-center gap-2 text-sm font-medium text-[var(--primary)] sm:inline-flex"
            >
              <Plus size={17} />
              Add lesson
            </Link>
          )}
        </div>

        {/* Loading */}
        {isLessonsLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl bg-[var(--surface)]"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {isLessonsError && (
          <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-6">
            <p className="font-medium text-[var(--danger)]">
              Failed to load lessons.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLessonsLoading && !isLessonsError && lessonList.length === 0 && (
          <EmptyLessons containerId={containerId} />
        )}

        {/* Lessons */}
        {!isLessonsLoading && !isLessonsError && lessonList.length > 0 && (
          <LessonList lessons={lessonList} containerId={containerId} />
        )}
      </section>
    </div>
  );
}
