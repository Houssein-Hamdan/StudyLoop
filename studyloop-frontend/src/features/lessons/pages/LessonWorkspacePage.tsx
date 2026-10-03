import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useLesson } from "../hooks/useLessons";
import { LessonHeader } from "../components/LessonHeader";
import { LessonProgress } from "../components/LessonProgress";
import TopicSidebar from "../components/TopicSidebar";
import { TopicContent } from "../components/TopicContent";
import { useOrCreateLessonProgress } from "../../progress/hooks/useProgress"; // 👈 إضافة الـ Hook

import type { Topic } from "../types";

export function LessonWorkspacePage() {
  const { containerId, lessonId } = useParams();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const lessonQuery = useLesson(containerId ?? "", lessonId ?? "");
  
  // 👈 جلب بيانات التقدم
  const progressQuery = useOrCreateLessonProgress(
    containerId ?? "",
    lessonId ?? ""
  );

  const lesson = lessonQuery.data;

  const topics = useMemo<Topic[]>(() => {
    return (lesson?.topics as Topic[]) ?? [];
  }, [lesson?.topics]);

  const activeTopicId =
    selectedTopicId && topics.some((topic) => topic.id === selectedTopicId)
      ? selectedTopicId
      : (topics[0]?.id ?? null);

  const selectedTopic = useMemo(() => {
    if (!activeTopicId) return null;
    return topics.find((topic) => topic.id === activeTopicId) ?? null;
  }, [topics, activeTopicId]);

  // 👈 حساب قائمة الـ Topics المكتملة لصفحة Workspace
  const completedTopicIds = useMemo<Set<string>>(() => {
    const list = progressQuery.data?.topicProgress;
    if (!Array.isArray(list)) return new Set();

    return new Set(
      list
        .filter((t) => t.isCompleted)
        .map((t) => t.topicId || t.id)
    );
  }, [progressQuery.data?.topicProgress]);

  const progress = progressQuery.data?.progress;

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
        <div className="space-y-3">
          <div className="h-10 w-2/3 animate-pulse rounded bg-[var(--surface-hover)]" />
          <div className="h-4 w-40 animate-pulse rounded bg-[var(--surface-hover)]" />
        </div>
        <div className="h-24 animate-pulse rounded-2xl bg-[var(--surface)]" />
        <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
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

  return (
    <div className="space-y-6">
      <LessonHeader
        containerId={containerId}
        title={lesson.title}
        topicsCount={topics.length}
      />

      {/* 👈 تحسين إظهار الـ Progress الحقيقي */}
      <LessonProgress 
        completedTopics={progress?.completedTopicsCount ?? completedTopicIds.size} 
        totalTopics={progress?.totalTopicsCount ?? topics.length} 
      />

      {topics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h2 className="text-lg font-semibold">No topics yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            This lesson does not contain any topics yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 lg:flex-row">
          <TopicSidebar
            topics={topics}
            activeTopicId={activeTopicId}
            completedTopicIds={completedTopicIds} 
            annotations={[]}
            onTopicClick={setSelectedTopicId}
            onAnnotationClick={() => {}}
            onAddTopic={() => {}}
          />

          <TopicContent topic={selectedTopic} />
        </div>
      )}
    </div>
  );
}