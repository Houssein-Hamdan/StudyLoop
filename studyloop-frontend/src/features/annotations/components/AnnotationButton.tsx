import { FileText, Plus } from 'lucide-react';

type AnnotationButtonProps = {
  count: number;
  onClick: () => void;
};

export default function AnnotationButton({
  count,
  onClick,
}: AnnotationButtonProps) {
  const hasAnnotations = count > 0;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="relative shrink-0 rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
      aria-label={
        hasAnnotations
          ? `Open ${count} annotation${count > 1 ? 's' : ''}`
          : 'Add annotation'
      }
    >
      {hasAnnotations ? (
        <FileText size={16} />
      ) : (
        <Plus size={16} />
      )}

      {hasAnnotations && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[9px] font-semibold text-[var(--primary-foreground)]">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}