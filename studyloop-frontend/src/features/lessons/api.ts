import { apiClient } from "../../lib/api/client";

export type CreateTopicPayload = {
  title?: string;
  description?: string;
};

export type CreateLessonPayload = {
  title: string;
  rawContent?: string;
  topics?: CreateTopicPayload[];
};

export async function createLesson(
  containerId: string,
  payload: CreateLessonPayload,
) {
  const response = await apiClient.post(
    `/containers/${containerId}/lessons`,
    payload,
  );

  return response.data;
}

export async function createTopic(
  containerId: string,
  lessonId: string,
  payload: CreateTopicPayload,
) {
  const response = await apiClient.post(
    `/containers/${containerId}/lessons/${lessonId}/topics`,
    payload,
  );

  return response.data;
}

export async function parseRawContent(containerId: string, rawContent: string) {
  const response = await apiClient.post(
    `/containers/${containerId}/lessons/parse-raw`,
    { rawContent },
  );

  return response.data;
}

export async function getLessons(containerId: string) {
  const response = await apiClient.get(`/containers/${containerId}/lessons`);

  return response.data.lessons ?? response.data;
}

export async function getLesson(containerId: string, lessonId: string) {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}`,
  );

  return response.data.lesson ?? response.data;
}
