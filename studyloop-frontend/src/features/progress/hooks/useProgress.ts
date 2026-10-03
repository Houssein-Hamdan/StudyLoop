import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getLessonProgress,
  getOrCreateLessonProgress,
  updateLessonProgress,
  updateTopicProgress,
} from "../api";
import type { LessonProgressResponse } from "../types"; 

export const progressKeys = {
  all: ["progress"] as const,

  lesson: (containerId: string, lessonId: string) =>
    ["progress", "lesson", containerId, lessonId] as const,
};

export function useLessonProgress(containerId: string, lessonId: string) {
  return useQuery({
    queryKey: progressKeys.lesson(containerId, lessonId),

    queryFn: () => getLessonProgress(containerId, lessonId),

    enabled: Boolean(containerId) && Boolean(lessonId),
  });
}

export function useOrCreateLessonProgress(
  containerId: string,
  lessonId: string,
) {
  return useQuery({
    queryKey: progressKeys.lesson(containerId, lessonId),

    queryFn: () => getOrCreateLessonProgress(containerId, lessonId),

    enabled: Boolean(containerId) && Boolean(lessonId),
  });
}
export function useUpdateTopicProgress(containerId: string, lessonId: string) {
  const queryClient = useQueryClient();

  const queryKey = progressKeys.lesson(containerId, lessonId);

  return useMutation({
    mutationFn: ({
      topicId,
      isCompleted,
    }: {
      topicId: string;
      isCompleted: boolean;
    }) => updateTopicProgress(containerId, lessonId, topicId, isCompleted),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}

export function useUpdateLessonProgress(containerId: string, lessonId: string) {
  const queryClient = useQueryClient();

  const queryKey = progressKeys.lesson(containerId, lessonId);

  return useMutation({
    mutationFn: (payload: { scrollPosition?: number }) =>
      updateLessonProgress(containerId, lessonId, payload),

    onSuccess: (response) => {
      queryClient.setQueryData<LessonProgressResponse>(
        queryKey,
        (currentData) => {
          if (!currentData) {
            return undefined;
          }

          return {
            ...currentData,
            progress: response.progress,
          };
        },
      );
    },
  });
}
