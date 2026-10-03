import { useQuery } from '@tanstack/react-query';
import { getAnalyticsOverview } from '../api';

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: ['analytics', 'overview'] as const,
};

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: analyticsKeys.overview,
    queryFn: getAnalyticsOverview,
  });
}