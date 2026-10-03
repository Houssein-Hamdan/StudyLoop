import { apiClient } from '../../lib/api/client';

import type {
  CompleteReviewResponse,
  DueReviewsResponse,
} from './types';

export async function getDueReviews(): Promise<DueReviewsResponse> {
  const response = await apiClient.get('/progress/due-reviews');

  return response.data;
}

export async function completeReview(
  containerId: string,
  lessonId: string,
): Promise<CompleteReviewResponse> {
  const response = await apiClient.post(
    `/containers/${containerId}/lessons/${lessonId}/progress/review`,
  );

  return response.data;
}