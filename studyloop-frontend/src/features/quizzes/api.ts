import { apiClient } from "../../lib/api/client";

import type {
  CreateQuizPayload,
  QuizListResponse,
  QuizResponse,
  SubmitQuizPayload,
  SubmitQuizResponse,
} from "./types";

export async function createQuiz(
  containerId: string,
  lessonId: string,
  payload: CreateQuizPayload,
): Promise<QuizResponse> {
  const response = await apiClient.post(
    `/containers/${containerId}/lessons/${lessonId}/quizzes`,
    payload,
  );

  return response.data;
}

export async function getQuiz(
  containerId: string,
  lessonId: string,
  quizId: string,
): Promise<QuizResponse> {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/quizzes/${quizId}`,
  );

  return response.data;
}

export async function getLessonQuizzes(
  containerId: string,
  lessonId: string,
): Promise<QuizListResponse> {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/quizzes`,
  );

  return response.data;
}

export async function submitQuiz(
  containerId: string,
  lessonId: string,
  payload: SubmitQuizPayload,
): Promise<SubmitQuizResponse> {
  const response = await apiClient.post(
    `/containers/${containerId}/lessons/${lessonId}/quizzes/${payload.quizId}/submit`,
    {
      answers: payload.answers,
    },
  );

  return response.data;
}