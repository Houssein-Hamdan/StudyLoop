import type { Progress } from '../../../entities/progress.entity.js';

export const PROGRESS_REPOSITORY = Symbol('PROGRESS_REPOSITORY');

export interface IProgressRepository {
  findByUserAndLesson(userId: string, lessonId: string): Promise<Progress | null>;
  findByUserId(userId: string): Promise<Progress[]>;
  findByLessonId(lessonId: string): Promise<Progress[]>;
  create(progress: Partial<Progress>): Promise<Progress>;
  update(id: string, progress: Partial<Progress>): Promise<Progress>;
  getOverallStats(userId: string): Promise<any>;
  findDueReviews(userId: string, currentdate:Date ):Promise<any>;
}