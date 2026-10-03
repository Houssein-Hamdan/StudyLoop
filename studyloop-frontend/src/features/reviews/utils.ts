export function formatReviewDate(date: string | null) {
  if (!date) {
    return 'Not reviewed yet';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getReviewIntervalLabel(days: number) {
  if (days === 1) return '1 day';
  return `${days} days`;
}