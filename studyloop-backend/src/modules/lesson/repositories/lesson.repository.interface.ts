import { Lesson } from '../../../entities/lesson.entity.js';
import { Topic } from '../../../entities/topic.entity.js';
export const LESSON_REPOSITORY = Symbol('LESSON_REPOSITORY');

export interface ILessonRepository {
  findById(id: string): Promise<Lesson | null>;
  findByIdAndContainerId(
    id: string,
    containerId: string,
  ): Promise<Lesson | null>;
  findAllByContainerId(containerId: string): Promise<Lesson[]>;
  findByShareToken(shareToken: string): Promise<Lesson | null>;
  create(lesson: Partial<Lesson>): Promise<Lesson>;
  update(id: string, lesson: Partial<Lesson>): Promise<Lesson>;
  delete(id: string): Promise<boolean>;
  findRecentByUserId(userId: string, limit: number): Promise<Lesson[]>;
  countByUserId(userId: string): Promise<number>;
  findByIdAndUserId(id: string, userId: string): Promise<Lesson | null>;
  createWithTopics(
    lesson: Partial<Lesson>,
    topics: Partial<Topic>[],
  ): Promise<Lesson>;
}
