import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSummary,
  getSummaries,
  getSummary,
  deleteSummary,
  type CreateSummaryPayload,
} from "../api";

export const summaryKeys = {
  all: ["summaries"] as const,

  list: (containerId: string, lessonId: string) =>
    ["summaries", "list", containerId, lessonId] as const,

  detail: (containerId: string, lessonId: string, summaryId: string) =>
    ["summaries", "detail", containerId, lessonId, summaryId] as const,
};

export function useSummaries(containerId: string, lessonId: string) {
  return useQuery({
    queryKey: summaryKeys.list(containerId, lessonId),

    queryFn: () => getSummaries(containerId, lessonId),

    enabled: Boolean(containerId) && Boolean(lessonId),
  });
}

export function useSummary(
  containerId: string,
  lessonId: string,
  summaryId: string,
) {
  return useQuery({
    queryKey: summaryKeys.detail(containerId, lessonId, summaryId),

    queryFn: () => getSummary(containerId, lessonId, summaryId),

    enabled: Boolean(containerId) && Boolean(lessonId) && Boolean(summaryId),
  });
}

export function useCreateSummary(containerId: string, lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSummaryPayload) =>
      createSummary(containerId, lessonId, payload),

    retry: 1, 

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: summaryKeys.list(containerId, lessonId),
      });
    },
  });
}

export function useDeleteSummary(containerId: string, lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (summaryId: string) =>
      deleteSummary(containerId, lessonId, summaryId),

    onSuccess: (_, summaryId) => {
      queryClient.invalidateQueries({
        queryKey: summaryKeys.list(containerId, lessonId),
      });

      queryClient.removeQueries({
        queryKey: summaryKeys.detail(containerId, lessonId, summaryId),
      });
    },
  });
}
