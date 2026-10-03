import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { askQuestion, deleteQuestion, getLessonQuestions } from "../api";

import type { CreateQuestionPayload } from "../types";

export const askKeys = {
  all: ["ask"] as const,

  lesson: (containerId: string, lessonId: string) =>
    ["ask", "lesson", containerId, lessonId] as const,
};

export function useLessonQuestions(containerId: string, lessonId: string) {
  return useQuery({
    queryKey: askKeys.lesson(containerId, lessonId),

    queryFn: () => getLessonQuestions(containerId, lessonId),

    enabled: Boolean(containerId) && Boolean(lessonId),
  });
}

export function useAskQuestion(containerId: string, lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuestionPayload) =>
      askQuestion(containerId, lessonId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: askKeys.lesson(containerId, lessonId),
      });
    },
  });
}
export function useDeleteQuestion(containerId: string, lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) =>
      deleteQuestion(containerId, lessonId, questionId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: askKeys.lesson(containerId, lessonId),
      });
    },
  });
}
