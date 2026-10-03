import { useQuery } from '@tanstack/react-query';

import { searchLessons } from '../api';

import type { SearchLessonParams } from '../types';

export const searchKeys = {
  all: ['search'] as const,

  lessons: (params: SearchLessonParams) =>
    ['search', 'lessons', params] as const,
};

export function useSearchLessons(
  params: SearchLessonParams,
) {
  const query = params.query?.trim() ?? '';

  return useQuery({
    queryKey: searchKeys.lessons({
      ...params,
      query,
    }),

    queryFn: () =>
      searchLessons({
        ...params,
        query,
      }),

    enabled: query.length > 0,

    staleTime: 30_000,
  });
}