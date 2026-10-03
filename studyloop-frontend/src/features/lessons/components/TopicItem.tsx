import { Check, Pencil, Trash2 } from 'lucide-react';
import AnnotationButton from '../../annotations/components/AnnotationButton';

import type { Topic } from '../types';

type TopicItemProps = {
  topic: Topic;
  isActive: boolean;
  isCompleted: boolean;
  annotationCount: number;
  onClick: () => void;
  onAnnotationClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function TopicItem({
  topic,
  isActive,
  isCompleted,
  annotationCount,
  onClick,
  onAnnotationClick,
  onEdit,
  onDelete,
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
            isActive ? 'font-medium' : 'text-[var(--muted)]',
          ].join(' ')}
        >
          {topic.title}
        </span>
      </button>

      {/* Action Buttons (Edit / Delete) - Hover Only */}
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)]"
            title="Edit topic"
          >
            <Pencil size={14} />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-red-500/10 hover:text-[var(--danger)]"
            title="Delete topic"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <AnnotationButton
        count={annotationCount}
        onClick={onAnnotationClick}
      />
    </div>
  );
}