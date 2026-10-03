import { apiClient } from '../../lib/api/client';

export type HomeStats = {
  totalLessons: number;
  completedLessons: number;
  totalTopics: number;
  totalCompleted: number;
  averageCompletion: number;
  lessonsInProgress: number;
};

export type HomeStatsResponse = {
  message?: string;
  stats: HomeStats;
};

export async function getHomeStats(): Promise<HomeStatsResponse> {
  const response = await apiClient.get('/progress/stats');

  return response.data;
}