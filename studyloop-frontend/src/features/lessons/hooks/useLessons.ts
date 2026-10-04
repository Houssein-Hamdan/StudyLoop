import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createLesson,
  createTopic,
  getLesson,
  getLessons,
  parseRawContent,
  type CreateLessonPayload,
  type CreateTopicPayload,
  updateTopic,
  deleteTopic,
} from "../api";

import { progressKeys } from "../../progress/hooks/useProgress";
import { homeKeys } from "../../home/hooks/useHome";

export const lessonKeys = {
  all: ["lessons"] as const,

  list: (containerId: string) =>
    ["lessons", "list", containerId] as const,

  detail: (containerId: string, lessonId: string) =>
    ["lessons", "detail", containerId, lessonId] as const,
};

export function useLessons(containerId: string) {
  return useQuery({
    queryKey: lessonKeys.list(containerId),
    queryFn: () => getLessons(containerId),
    enabled: Boolean(containerId),
  });
}

export function useLesson(
  containerId: string,
  lessonId: string,
) {
  return useQuery({
    queryKey: lessonKeys.detail(
      containerId,
      lessonId,
    ),
    queryFn: () =>
      getLesson(
        containerId,
        lessonId,
      ),
    enabled:
      Boolean(containerId) &&
      Boolean(lessonId),
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      containerId,
      payload,
    }: {
      containerId: string;
      payload: CreateLessonPayload;
    }) =>
      createLesson(
        containerId,
        payload,
      ),

    onSuccess: async (_, variables) => {
      await Promise.all([
        // Update container lessons
        queryClient.invalidateQueries({
          queryKey: lessonKeys.list(
            variables.containerId,
          ),
        }),

        // Update Home statistics
        queryClient.invalidateQueries({
          queryKey: homeKeys.stats,
        }),

        // Update Home recent activity
        queryClient.invalidateQueries({
          queryKey: homeKeys.activity,
        }),
      ]);
    },
  });
}

export function useCreateTopic(
  containerId: string,
  lessonId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateTopicPayload,
    ) =>
      createTopic(
        containerId,
        lessonId,
        payload,
      ),

    onSuccess: async () => {
      await Promise.all([
        // Update current lesson
        queryClient.invalidateQueries({
          queryKey: lessonKeys.detail(
            containerId,
            lessonId,
          ),
        }),

        // Update lesson progress
        queryClient.invalidateQueries({
          queryKey: progressKeys.lesson(
            containerId,
            lessonId,
          ),
        }),

        // Update Home statistics
        queryClient.invalidateQueries({
          queryKey: homeKeys.stats,
        }),

        // Update Home recent activity
        queryClient.invalidateQueries({
          queryKey: homeKeys.activity,
        }),
      ]);
    },
  });
}

export function useParseRawContent() {
  return useMutation({
    mutationFn: ({
      containerId,
      rawContent,
    }: {
      containerId: string;
      rawContent: string;
    }) =>
      parseRawContent(
        containerId,
        rawContent,
      ),
  });
}

export function useUpdateTopic(
  containerId: string,
  lessonId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      payload,
    }: {
      topicId: string;
      payload: {
        title?: string;
        description?: string | null;
      };
    }) =>
      updateTopic(
        containerId,
        lessonId,
        topicId,
        payload,
      ),

    onSuccess: async () => {
      await Promise.all([
        // Update current lesson
        queryClient.invalidateQueries({
          queryKey: lessonKeys.detail(
            containerId,
            lessonId,
          ),
        }),

        // Update Home recent activity
        queryClient.invalidateQueries({
          queryKey: homeKeys.activity,
        }),
      ]);
    },
  });
}

export function useDeleteTopic(
  containerId: string,
  lessonId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      topicId: string,
    ) =>
      deleteTopic(
        containerId,
        lessonId,
        topicId,
      ),

    onSuccess: async () => {
      await Promise.all([
        // Update current lesson
        queryClient.invalidateQueries({
          queryKey: lessonKeys.detail(
            containerId,
            lessonId,
          ),
        }),

        // Update lesson progress
        queryClient.invalidateQueries({
          queryKey: progressKeys.lesson(
            containerId,
            lessonId,
          ),
        }),

        // Update Home statistics
        queryClient.invalidateQueries({
          queryKey: homeKeys.stats,
        }),

        // Update Home recent activity
        queryClient.invalidateQueries({
          queryKey: homeKeys.activity,
        }),
      ]);
    },
  });
}