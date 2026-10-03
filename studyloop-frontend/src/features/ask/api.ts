import { apiClient } from '../../lib/api/client';

import type {
  AskQuestionResponse,
  AskQuestionsResponse,
  CreateQuestionPayload,
} from './types';

export async function askQuestion(
  containerId: string,
  lessonId: string,
  payload: CreateQuestionPayload,
): Promise<AskQuestionResponse> {
  const response = await apiClient.post(
    `/containers/${containerId}/lessons/${lessonId}/ask`,
    payload,
  );

  return response.data;
}

export async function getLessonQuestions(
  containerId: string,
  lessonId: string,
): Promise<AskQuestionsResponse> {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/ask`,
  );

  return response.data;
}

export async function getQuestion(
  containerId: string,
  lessonId: string,
  questionId: string,
) {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/ask/${questionId}`,
  );

  return response.data;
}

export async function deleteQuestion(
  containerId: string,
  lessonId: string,
  questionId: string,
) {
  const response = await apiClient.delete(
    `/containers/${containerId}/lessons/${lessonId}/ask/${questionId}`,
  );

  return response.data;
}