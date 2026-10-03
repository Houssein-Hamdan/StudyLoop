import { apiClient } from '../../lib/api/client';

export type SummaryDepth =
  | 'short'
  | 'medium'
  | 'detailed';

export type CreateSummaryPayload = {
  depth: SummaryDepth;
  selectedTopicIds?: string[];
};

export async function createSummary(
  containerId: string,
  lessonId: string,
  payload: CreateSummaryPayload,
) {
  const response = await apiClient.post(
    `/containers/${containerId}/lessons/${lessonId}/summaries`,
    payload,
  );

  return response.data;
}

export async function getSummaries(
  containerId: string,
  lessonId: string,
) {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/summaries`,
  );

  return response.data;
}

export async function getSummary(
  containerId: string,
  lessonId: string,
  summaryId: string,
) {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/summaries/${summaryId}`,
  );

  return response.data;
}

export async function deleteSummary(
  containerId: string,
  lessonId: string,
  summaryId: string,
) {
  const response = await apiClient.delete(
    `/containers/${containerId}/lessons/${lessonId}/summaries/${summaryId}`,
  );

  return response.data;
}