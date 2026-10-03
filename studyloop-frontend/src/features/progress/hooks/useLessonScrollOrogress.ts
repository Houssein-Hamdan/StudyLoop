import { useEffect } from 'react';

import { useUpdateLessonProgress } from '../../progress/hooks/useProgress';

type UseLessonScrollProgressProps = {
  containerId: string;
  lessonId: string;
  scrollPosition: number;
};

export function useLessonScrollProgress({
  containerId,
  lessonId,
  scrollPosition,
}: UseLessonScrollProgressProps) {
  const mutation = useUpdateLessonProgress(
    containerId,
    lessonId,
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      mutation.mutate({
        scrollPosition,
      });
    }, 800);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    mutation,
    scrollPosition,
  ]);

  return mutation;
}