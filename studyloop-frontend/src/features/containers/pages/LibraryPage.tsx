import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { useContainers } from "../hooks/useContainers";

import { ContainerGrid } from "../components/ContainerGrid";
import { EmptyContainers } from "../components/EmptyContainers";
import { CreateContainerModal } from "../components/CreateContainerModal";

export function LibraryPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: containers, isLoading, isError, error } = useContainers();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--primary)]">
            Knowledge Workspace
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Your Library
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Organize your knowledge into containers and lessons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* رابط البحث الذي ينتقل إلى صفحة البحث */}
          <Link
            to="/search"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          >
            <Search size={17} />
            <span>Search...</span>
            <kbd className="ml-auto hidden rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] sm:inline">
              /
            </kbd>
          </Link>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            <Plus size={18} />
            New Container
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-6">
          <h2 className="font-semibold text-[var(--danger)]">
            Failed to load your library
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading your containers."}
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && containers && containers.length === 0 && (
        <EmptyContainers onCreate={() => setIsCreateModalOpen(true)} />
      )}

      {/* Containers */}
      {!isLoading && !isError && containers && containers.length > 0 && (
        <ContainerGrid containers={containers} />
      )}

      {/* Create modal */}
      <CreateContainerModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
