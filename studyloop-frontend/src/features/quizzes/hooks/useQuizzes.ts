import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createQuiz, getQuiz, getLessonQuizzes, submitQuiz } from "../api";

import type { CreateQuizPayload, SubmitQuizPayload } from "../types";

export const quizKeys = {
  all: ["quizzes"] as const,

  list: (containerId: string, lessonId: string) =>
    ["quizzes", "list", containerId, lessonId] as const,

  detail: (containerId: string, lessonId: string, quizId: string) =>
    ["quizzes", "detail", containerId, lessonId, quizId] as const,
};

export function useQuiz(containerId: string, lessonId: string, quizId: string) {
  return useQuery({
    queryKey: quizKeys.detail(containerId, lessonId, quizId),

    queryFn: () => getQuiz(containerId, lessonId, quizId),

    enabled: Boolean(containerId) && Boolean(lessonId) && Boolean(quizId),
  });
}

export function useLessonQuizzes(containerId: string, lessonId: string) {
  return useQuery({
    queryKey: quizKeys.list(containerId, lessonId),

    queryFn: () => getLessonQuizzes(containerId, lessonId),

    enabled: Boolean(containerId) && Boolean(lessonId),
  });
}

export function useCreateQuiz(containerId: string, lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuizPayload) =>
      createQuiz(containerId, lessonId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.list(containerId, lessonId),
      });
    },
  });
}

export function useSubmitQuiz(containerId: string, lessonId: string) {
  return useMutation({
    mutationFn: (payload: SubmitQuizPayload) =>
      submitQuiz(containerId, lessonId, payload),
  });
}
