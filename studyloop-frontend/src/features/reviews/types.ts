import type { LessonProgress } from '../progress/types';

export type DueReview = LessonProgress & {
  lesson: {
    id: string;
    title: string;
    containerId: string;
  };
};

export type DueReviewsResponse = {
  message: string;
  count: number;
  reviews: DueReview[];
};

export type CompleteReviewResponse = {
  message: string;
  progress: LessonProgress;
};