import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  completeReview,
  getDueReviews,
} from '../api';

export const reviewKeys = {
  all: ['reviews'] as const,

  due: () =>
    ['reviews', 'due'] as const,
};

export function useDueReviews() {
  return useQuery({
    queryKey: reviewKeys.due(),
    queryFn: getDueReviews,
  });
}

export function useCompleteReview(
  containerId: string,
  lessonId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      completeReview(containerId, lessonId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: reviewKeys.due(),
      });

      await queryClient.invalidateQueries({
        queryKey: ['progress'],
      });
    },
  });
}