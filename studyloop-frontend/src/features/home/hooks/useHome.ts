import { useQuery } from '@tanstack/react-query';

import { getHomeStats } from '../api';

import { getAnalyticsOverview } from '../../analytics/api';
import { getDueReviews } from '../../reviews/api';

export const homeKeys = {
  all: ['home'] as const,

  stats: ['home', 'stats'] as const,

  activity: ['home', 'activity'] as const,

  reviews: ['home', 'reviews'] as const,
};

export function useHomeStats() {
  return useQuery({
    queryKey: homeKeys.stats,
    queryFn: getHomeStats,
    staleTime: 30_000,
  });
}

export function useHomeActivity() {
  return useQuery({
    queryKey: homeKeys.activity,
    queryFn: getAnalyticsOverview,
    staleTime: 30_000,
    select: (data) => data.recentActivity,
  });
}

export function useHomeReviews() {
  return useQuery({
    queryKey: homeKeys.reviews,
    queryFn: getDueReviews,
    staleTime: 30_000,
  });
}