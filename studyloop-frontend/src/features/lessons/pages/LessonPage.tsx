import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { LessonHeader } from "../components/LessonHeader";
import TopicSidebar from "../components/TopicSidebar";
import { LessonContent } from "../components/LessonContent";
import { LessonProgress } from "../components/LessonProgress";
import AnnotationModal from "../../annotations/components/AnnotationModal";
import { useLessonAnnotations } from "../../annotations/hooks/useAnnotations";
import { useLesson, useCreateTopic } from "../hooks/useLessons";
import { LessonActions } from "../components/LessonActions";
import {
  useLessonProgress,
  useUpdateTopicProgress,
} from "../../progress/hooks/useProgress";
import { AddTopicModal } from "../components/AddTopicModal";

import type { Topic } from "../types";

export function LessonPage() {
  const { containerId, lessonId } = useParams();

  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const [annotationTopicId, setAnnotationTopicId] = useState<string | null>(
    null,
  );
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const createTopicMutation = useCreateTopic(containerId ?? "", lessonId ?? "");

  const { data: annotations = [] } = useLessonAnnotations(lessonId ?? "");

  const lessonQuery = useLesson(containerId ?? "", lessonId ?? "");
  const lesson = lessonQuery.data;

  // 1. تعريف topics
  const topics = useMemo<Topic[]>(() => {
    return (lesson?.topics as Topic[]) ?? [];
  }, [lesson?.topics]);

  const annotationTopic = topics.find(
    (topic) => topic.id === annotationTopicId,
  );

  const progressQuery = useLessonProgress(containerId ?? "", lessonId ?? "");

  const updateTopicMutation = useUpdateTopicProgress(
    containerId ?? "",
    lessonId ?? "",
  );

  const resolvedActiveTopicId =
    activeTopicId && topics.some((topic) => topic.id === activeTopicId)
      ? activeTopicId
      : (topics[0]?.id ?? null);

  const activeTopic = useMemo(() => {
    if (!resolvedActiveTopicId) {
      return null;
    }

    return topics.find((topic) => topic.id === resolvedActiveTopicId) ?? null;
  }, [topics, resolvedActiveTopicId]);

  const completedTopicIds = useMemo<Set<string>>(() => {
    const topicProgressList = progressQuery.data?.topicProgress;

    if (!Array.isArray(topicProgressList)) return new Set();

    const completedSet = new Set<string>();

    topicProgressList.forEach((item) => {
      const isDone = item.isCompleted ?? item.isCompleted ?? false;
      const id = item.topicId ?? item.id;

      if (isDone && id) {
        completedSet.add(String(id));
      }
    });

    return completedSet;
  }, [progressQuery.data?.topicProgress]);

  const activeTopicCompleted = useMemo(() => {
    if (!activeTopic) return false;
    return completedTopicIds.has(String(activeTopic.id));
  }, [activeTopic, completedTopicIds]);

  function handleToggleComplete() {
    if (!activeTopic) {
      return;
    }

    const nextState = !activeTopicCompleted;

    updateTopicMutation.mutate({
      topicId: activeTopic.id,
      isCompleted: nextState,
    });
  }

  if (!containerId || !lessonId) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--muted)]">
          Lesson information is missing.
        </p>
      </div>
    );
  }

  if (lessonQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--surface-hover)]" />
        <div className="h-10 w-2/3 animate-pulse rounded bg-[var(--surface-hover)]" />
        <div className="h-24 animate-pulse rounded-2xl bg-[var(--surface)]" />
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
          <div className="h-96 animate-pulse rounded-2xl bg-[var(--surface)]" />
          <div className="h-96 animate-pulse rounded-2xl bg-[var(--surface)]" />
        </div>
      </div>
    );
  }

  if (lessonQuery.isError || !lesson) {
    return (
      <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--surface)] p-6">
        <h2 className="font-semibold">Unable to load this lesson</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Please try opening the lesson again.
        </p>
      </div>
    );
  }

  function handleAddTopic(data: { title: string; description: string }) {
    createTopicMutation.mutate(
      {
        title: data.title,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          setIsAddTopicOpen(false);
        },
      },
    );
  }

  const progress = progressQuery.data?.progress;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 md:py-6">
      {/* Header */}
      <LessonHeader
        containerId={containerId}
        title={lesson.title}
        topicsCount={topics.length}
      />

      {/* Actions */}
      <div className="mt-4 md:mt-5">
        <LessonActions containerId={containerId} lessonId={lessonId} />
      </div>

      {/* Progress Bar */}
      <div className="mt-4 md:mt-6">
        <LessonProgress
          completedTopics={
            progress?.completedTopicsCount ?? completedTopicIds.size
          }
          totalTopics={progress?.totalTopicsCount ?? topics.length}
        />
      </div>

      {/* Error Alert */}
      {progressQuery.isError && (
        <div className="mt-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--surface)] px-4 py-3 text-sm text-[var(--danger)]">
          Unable to load your progress.
        </div>
      )}

      {/* Content Layout using Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        <TopicSidebar
          topics={lesson.topics}
          activeTopicId={resolvedActiveTopicId}
          completedTopicIds={completedTopicIds}
          annotations={annotations}
          onTopicClick={setActiveTopicId}
          onAnnotationClick={setAnnotationTopicId}
          onAddTopic={() => setIsAddTopicOpen(true)}
        />

        <main className="min-w-0">
          <LessonContent
            topic={activeTopic}
            completed={activeTopicCompleted}
            isUpdating={updateTopicMutation.isPending}
            onToggleComplete={handleToggleComplete}
          />
        </main>
      </div>

      {/* Modals */}
      {annotationTopicId && annotationTopic && (
        <AnnotationModal
          lessonId={lessonId}
          topicId={annotationTopic.id}
          topicTitle={annotationTopic.title}
          annotations={annotations}
          onClose={() => setAnnotationTopicId(null)}
        />
      )}

      <AddTopicModal
        isOpen={isAddTopicOpen}
        isSubmitting={createTopicMutation.isPending}
        onClose={() => setIsAddTopicOpen(false)}
        onSubmit={handleAddTopic}
      />
    </div>
  );
}
