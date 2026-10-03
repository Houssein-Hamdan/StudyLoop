import type { Summary } from '../../../entities/summary.entity.js';

export const SUMMARY_REPOSITORY = Symbol('SUMMARY_REPOSITORY');

export interface ISummaryRepository {
  findById(id: string): Promise<Summary | null>;
  findByLessonId(lessonId: string): Promise<Summary[]>;
  findByLessonIdAndDepth(lessonId: string, depth: string): Promise<Summary | null>;
  create(summary: Partial<Summary>): Promise<Summary>;
  update(id: string, summary: Partial<Summary>): Promise<Summary>;
  delete(id: string): Promise<boolean>;
}