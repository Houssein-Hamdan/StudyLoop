import type { Annotation } from "../../annotations/types";
import TopicItem from "./TopicItem";
import type { Topic } from "../types";

type TopicSidebarProps = {
  topics: Topic[];
  activeTopicId: string | null;
  completedTopicIds: Set<string>;
  annotations: Annotation[];
  onTopicClick: (topicId: string) => void;
  onAnnotationClick: (topicId: string) => void;
  onAddTopic?: () => void;
};

export default function TopicSidebar({
  topics,
  activeTopicId,
  completedTopicIds,
  annotations,
  onTopicClick,
  onAnnotationClick,
  onAddTopic,
}: TopicSidebarProps) {
  const completedCount = topics.filter((topic) =>
    completedTopicIds.has(topic.id),
  ).length;

  return (
    <aside className="w-full shrink-0 border-b border-[var(--border)] lg:w-72 lg:border-b-0 lg:border-r">
      <div className="p-4 sm:p-5">
        {/* Progress Bar (Mobile u Desktop) */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Topics</h2>
            <span className="text-xs text-[var(--muted)]">
              {completedCount}/{topics.length}
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
              style={{
                width: `${
                  topics.length > 0 ? (completedCount / topics.length) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* --- MOBILE VIEW (< md) --- */}
        <div className="space-y-3 md:hidden">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
              Select Topic
            </label>

            <select
              value={activeTopicId ?? ""}
              onChange={(e) => onTopicClick(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {completedTopicIds.has(topic.id) ? "✓ " : ""}
                  {topic.title}
                </option>
              ))}
            </select>
          </div>

          {onAddTopic && (
            <button
              type="button"
              onClick={onAddTopic}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]"
            >
              <span className="text-lg leading-none">+</span>
              Add Topic
            </button>
          )}
        </div>

        {/* --- DESKTOP VIEW (>= md) --- */}
        <div className="hidden md:block">
          {onAddTopic && (
            <button
              type="button"
              onClick={onAddTopic}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-3 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]"
            >
              <span className="text-lg leading-none">+</span>
              Add Topic
            </button>
          )}

          <div className="space-y-1">
            {topics.map((topic) => {
              const annotationCount = annotations.filter(
                (annotation) => annotation.topicId === topic.id,
              ).length;

              return (
                <TopicItem
                  key={topic.id}
                  topic={topic}
                  isActive={topic.id === activeTopicId}
                  isCompleted={completedTopicIds.has(topic.id)}
                  annotationCount={annotationCount}
                  onClick={() => onTopicClick(topic.id)}
                  onAnnotationClick={() => onAnnotationClick(topic.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}