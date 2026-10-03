import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createAnnotation,
  deleteAnnotation,
  getLessonAnnotations,
  updateAnnotation,
} from '../api';

import type {
  CreateAnnotationPayload,
  UpdateAnnotationPayload,
} from '../types';

export const annotationKeys = {
  all: ['annotations'] as const,

  lesson: (lessonId: string) =>
    ['annotations', 'lesson', lessonId] as const,
};

export function useLessonAnnotations(lessonId: string) {
  return useQuery({
    queryKey: annotationKeys.lesson(lessonId),
    queryFn: () => getLessonAnnotations(lessonId),
    enabled: Boolean(lessonId),
  });
}

export function useCreateAnnotation(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAnnotationPayload) =>
      createAnnotation(lessonId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: annotationKeys.lesson(lessonId),
      });
    },
  });
}

export function useUpdateAnnotation(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      annotationId,
      payload,
    }: {
      annotationId: string;
      payload: UpdateAnnotationPayload;
    }) =>
      updateAnnotation(
        lessonId,
        annotationId,
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: annotationKeys.lesson(lessonId),
      });
    },
  });
}

export function useDeleteAnnotation(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (annotationId: string) =>
      deleteAnnotation(lessonId, annotationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: annotationKeys.lesson(lessonId),
      });
    },
  });
}