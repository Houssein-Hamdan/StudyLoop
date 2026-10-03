import { Check } from 'lucide-react';

import AnnotationButton from '../../annotations/components/AnnotationButton';

import type { Topic } from '../types';

type TopicItemProps = {
  topic: Topic;
  isActive: boolean;
  isCompleted: boolean;
  annotationCount: number;
  onClick: () => void;
  onAnnotationClick: () => void;
};

export default function TopicItem({
  topic,
  isActive,
  isCompleted,
  annotationCount,
  onClick,
  onAnnotationClick,
}: TopicItemProps) {
  return (
    <div
      className={[
        'group flex items-center gap-1 rounded-xl transition-colors',
        isActive
          ? 'bg-[var(--surface-hover)]'
          : 'hover:bg-[var(--surface-hover)]',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
      >
        <div
          className={[
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors',
            isCompleted
              ? 'border-[var(--success)] bg-[var(--success)] text-white'
              : isActive
                ? 'border-[var(--primary)]'
                : 'border-[var(--border)]',
          ].join(' ')}
        >
          {isCompleted && <Check size={13} />}
        </div>

        <span
          className={[
            'min-w-0 flex-1 truncate text-sm',
            isActive
              ? 'font-medium'
              : 'text-[var(--muted)]',
          ].join(' ')}
        >
          {topic.title}
        </span>
      </button>

      <AnnotationButton
        count={annotationCount}
        onClick={onAnnotationClick}
      />
    </div>
  );
}