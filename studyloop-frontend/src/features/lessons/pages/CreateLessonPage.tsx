import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useCreateLesson } from "../hooks/useLessons";

import { CreateLessonModeSelector } from "../components/CreateLessonModeSelector";
import { StructuredLessonForm } from "../components/StructuredLessonForm";
import { PasteLessonForm } from "../components/PasteLessonForm";

type CreateMode = "structured" | "paste";

export function CreateLessonPage() {
  const { containerId } = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<CreateMode>("structured");

  const createLessonMutation = useCreateLesson();

  if (!containerId) {
    return (
      <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-6 text-[var(--danger)]">
        Container ID is missing.
      </div>
    );
  }

  async function handleCreateLesson(payload: {
    title: string;
    rawContent?: string;
    topics?: {
      title?: string;
      description?: string;
    }[];
  }) {
    try {
      const lesson = await createLessonMutation.mutateAsync({
        containerId: containerId!,
        payload,
      });

      const createdLesson = lesson?.lesson ?? lesson;

      if (createdLesson?.id) {
        navigate(`/containers/${containerId}/lessons/${createdLesson.id}`);
        return;
      }

      navigate(`/containers/${containerId}`);
    } catch {
      // Error is handled by the form below.
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Back */}
      <Link
        to={`/containers/${containerId}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={16} />
        Back to Container
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Create Lesson</h1>

        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Turn your knowledge into a structured lesson you can review, test, and
          track.
        </p>
      </div>

      {/* Mode */}
      <CreateLessonModeSelector mode={mode} onChange={setMode} />

      {/* Form */}
      {mode === "structured" ? (
        <StructuredLessonForm
          onSubmit={handleCreateLesson}
          isSubmitting={createLessonMutation.isPending}
          error={
            createLessonMutation.isError ? createLessonMutation.error : null
          }
        />
      ) : (
        <PasteLessonForm
          containerId={containerId}
          onSubmit={handleCreateLesson}
          isSubmitting={createLessonMutation.isPending}
          error={
            createLessonMutation.isError ? createLessonMutation.error : null
          }
        />
      )}
    </div>
  );
}
