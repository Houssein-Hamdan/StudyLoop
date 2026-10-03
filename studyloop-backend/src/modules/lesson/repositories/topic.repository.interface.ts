import { Topic } from '../../../entities/topic.entity.js';

export const TOPIC_REPOSITORY = Symbol('TOPIC_REPOSITORY');

export interface ITopicRepository {
  findById(id: string): Promise<Topic | null>;
  findByIdAndLessonId(id: string, lessonId: string): Promise<Topic | null>;
  findAllByLessonId(lessonId: string): Promise<Topic[]>;
  create(topic: Partial<Topic>): Promise<Topic>;
  update(id: string, topic: Partial<Topic>): Promise<Topic>;
  delete(id: string): Promise<boolean>;
  createMany(topics: Partial<Topic>[]): Promise<Topic[]>;
  countByUserId(userId: string): Promise<number>;
  countCompletedByUserId(userId: string): Promise<number>;
}
