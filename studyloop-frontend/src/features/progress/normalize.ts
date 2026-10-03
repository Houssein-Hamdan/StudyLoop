import type {
  LessonProgress,
  LessonProgressResponse,
} from './types';

export function normalizeLessonProgress(
  response: LessonProgressResponse,
): LessonProgress {
  return response.progress;
}