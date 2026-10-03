import { Annotation } from '../../../entities/annotation.entity.js';

export const ANNOTATION_REPOSITORY = 'ANNOTATION_REPOSITORY';

export interface IAnnotationRepository {
  create(data: Partial<Annotation>): Promise<Annotation>;
  findByLessonAndUser(lessonId: string, userId: string): Promise<Annotation[]>;
  findById(id: string): Promise<Annotation | null>;
  update(id: string, data: Partial<Annotation>): Promise<Annotation | null>;
  delete(id: string): Promise<boolean>;
  countByUserId(userId: string): Promise<number>;
}
