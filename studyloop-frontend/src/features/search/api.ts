import { apiClient } from '../../lib/api/client';

import type {
  SearchLessonParams,
  SearchLessonsResponse,
} from './types';

export async function searchLessons(
  params: SearchLessonParams = {},
): Promise<SearchLessonsResponse> {
  const response = await apiClient.get('/search/lessons', {
    params: {
      ...params,
      skip: params.skip ?? 0,
      take: params.take ?? 10,
    },
  });

  return response.data;
}