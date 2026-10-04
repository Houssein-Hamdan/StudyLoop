import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getHomeStats } from "../api";
import { getAnalyticsOverview } from "../../analytics/api";
import { getDueReviews } from "../../reviews/api";

export const homeKeys = {
  all: ["home"] as const,
  stats: ["home", "stats"] as const,
  activity: ["home", "activity"] as const,
  reviews: ["home", "reviews"] as const,
};

export function useHomeStats() {
  return useQuery({
    queryKey: homeKeys.stats,
    queryFn: getHomeStats,
    staleTime: 0,
  });
}

export function useHomeActivity() {
  return useQuery({
    queryKey: homeKeys.activity,
    queryFn: getAnalyticsOverview,
    staleTime: 0,
    select: (data) => data.recentActivity,
  });
}

export function useHomeReviews() {
  return useQuery({
    queryKey: homeKeys.reviews,
    queryFn: getDueReviews,
    staleTime: 0,
  });
}

export function useInvalidateHome() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: homeKeys.stats,
      }),

      queryClient.invalidateQueries({
        queryKey: homeKeys.activity,
      }),

      queryClient.invalidateQueries({
        queryKey: homeKeys.reviews,
      }),
    ]);
}