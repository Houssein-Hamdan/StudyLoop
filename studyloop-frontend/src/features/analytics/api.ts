import { apiClient } from '../../lib/api/client';
import type { AnalyticsResponse } from './types';

export async function getAnalyticsOverview(): Promise<AnalyticsResponse> {
  const response = await apiClient.get('/analytics/overview');

  return response.data;
}