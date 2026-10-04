import { useState } from "react";
import { ChevronDown, Check, Pencil, Trash2 } from "lucide-react";

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
  onEditTopic: (topic: Topic) => void;
  onDeleteTopic: (topic: Topic) => void;
};

export default function TopicSidebar({
  topics,
  activeTopicId,
  completedTopicIds,
  annotations,
  onTopicClick,
  onAnnotationClick,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
}: TopicSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const completedCount = topics.filter((topic) =>
    completedTopicIds.has(topic.id),
  ).length;

  const activeTopic = topics.find((t) => t.id === activeTopicId);

  return (
    <aside className="w-full shrink-0 border-b border-[var(--border)] lg:w-72 lg:border-b-0 lg:border-r">
      <div className="p-4 sm:p-5">
        {/* Progress Bar (Mobile & Desktop) */}
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
          <div className="relative">
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
              Select Topic
            </label>

            {/* Custom Dropdown Button */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-medium outline-none transition focus:border-[var(--primary)]"
            >
              <span className="truncate">
                {activeTopic ? activeTopic.title : "Select a topic..."}
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-[var(--muted)] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Custom Options List */}
            {isOpen && (
              <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl">
                {topics.map((topic) => {
                  const isSelected = topic.id === activeTopicId;
                  const isCompleted = completedTopicIds.has(topic.id);

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        onTopicClick(topic.id);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                        isSelected
                          ? "bg-[var(--primary)]/10 font-medium text-[var(--primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                      }`}
                    >
                      <span className="truncate">{topic.title}</span>
                      {isCompleted && (
                        <Check
                          size={14}
                          className="shrink-0 text-[var(--success)]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons for Active Topic on Mobile */}
          {activeTopic && (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onEditTopic(activeTopic)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--primary)]"
              >
                <Pencil size={13} />
                Edit Topic
              </button>

              <button
                type="button"
                onClick={() => onDeleteTopic(activeTopic)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
              >
                <Trash2 size={13} />
                Delete Topic
              </button>
            </div>
          )}

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
                  onEdit={() => onEditTopic(topic)}
                  onDelete={() => onDeleteTopic(topic)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
