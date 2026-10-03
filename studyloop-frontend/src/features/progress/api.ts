import { apiClient } from '../../lib/api/client';

import type {
  LessonProgressResponse,
  TopicProgressResponse,
} from './types';

export async function getLessonProgress(
  containerId: string,
  lessonId: string,
): Promise<LessonProgressResponse> {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/progress/details`,
  );

  return response.data;
}

export async function getOrCreateLessonProgress(
  containerId: string,
  lessonId: string,
) {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/progress`,
  );

  return response.data;
}

export async function updateLessonProgress(
  containerId: string,
  lessonId: string,
  payload: {
    scrollPosition?: number;
  },
) {
  const response = await apiClient.put(
    `/containers/${containerId}/lessons/${lessonId}/progress`,
    payload,
  );

  return response.data;
}

export async function updateTopicProgress(
  containerId: string,
  lessonId: string,
  topicId: string,
  isCompleted: boolean,
): Promise<TopicProgressResponse> {
  const response = await apiClient.patch(
    `/containers/${containerId}/lessons/${lessonId}/progress/topics/${topicId}`,
    {
      isCompleted,
    },
  );

  return response.data;
}