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

export type UpdateLessonPayload = {
  title?: string;
  rawContent?: string;
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

export async function updateLesson(
  containerId: string,
  lessonId: string,
  payload: UpdateLessonPayload,
) {
  const response = await apiClient.put(
    `/containers/${containerId}/lessons/${lessonId}`,
    payload,
  );

  return response.data;
}

export async function deleteLesson(containerId: string, lessonId: string) {
  const response = await apiClient.delete(
    `/containers/${containerId}/lessons/${lessonId}`,
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

export type UpdateTopicPayload = {
  title?: string;
  description?: string | null;
};

export async function updateTopic(
  containerId: string,
  lessonId: string,
  topicId: string,
  payload: UpdateTopicPayload,
) {
  const response = await apiClient.put(
    `/containers/${containerId}/lessons/${lessonId}/topics/${topicId}`,
    payload,
  );

  return response.data;
}

export async function deleteTopic(
  containerId: string,
  lessonId: string,
  topicId: string,
) {
  const response = await apiClient.delete(
    `/containers/${containerId}/lessons/${lessonId}/topics/${topicId}`,
  );

  return response.data;
}
