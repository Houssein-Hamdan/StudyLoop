import { apiClient } from "../../lib/api/client";

export type SummaryDepth = "short" | "medium" | "detailed";

export type CreateSummaryPayload = {
  depth: SummaryDepth;
  selectedTopicIds?: string[];
};

export type Summary = {
  id: string;
  lessonId: string;
  depth: SummaryDepth;
  content: string;
  selectedTopicIds: string[] | null;
  createdAt: string;
  updatedAt: string;
};

export async function createSummary(
  containerId: string,
  lessonId: string,
  payload: CreateSummaryPayload,
): Promise<Summary> {
  const response = await apiClient.post(
    `/containers/${containerId}/lessons/${lessonId}/summaries`,
    payload,
  );

  return response.data.summary;
}

export async function getSummaries(
  containerId: string,
  lessonId: string,
): Promise<Summary[]> {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/summaries`,
  );

  return response.data.summaries;
}

export async function getSummary(
  containerId: string,
  lessonId: string,
  summaryId: string,
): Promise<Summary> {
  const response = await apiClient.get(
    `/containers/${containerId}/lessons/${lessonId}/summaries/${summaryId}`,
  );

  return response.data.summary;
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
