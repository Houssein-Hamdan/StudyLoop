import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ANNOTATION_REPOSITORY } from './repositories/annotation.repository.interface.js';
import type { IAnnotationRepository } from './repositories/annotation.repository.interface.js';
import { CreateAnnotationDto } from './dto/create-annotation.dto.js';
import { UpdateAnnotationDto } from './dto/update-annotation.dto.js';
import { LESSON_REPOSITORY } from '../lesson/repositories/lesson.repository.interface.js';
import type { ILessonRepository } from '../lesson/repositories/lesson.repository.interface.js';

@Injectable()
export class AnnotationService {
  constructor(
    @Inject(ANNOTATION_REPOSITORY)
    private readonly annotationRepository: IAnnotationRepository,
    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async create(userId: string, lessonId: string, dto: CreateAnnotationDto) {
    const lesson = await this.lessonRepository.findByIdAndUserId(
      lessonId,
      userId,
    );

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return await this.annotationRepository.create({
      ...dto,
      userId,
      lessonId,
    });
  }

  async findByLesson(userId: string, lessonId: string) {
    return await this.annotationRepository.findByLessonAndUser(
      lessonId,
      userId,
    );
  }

  async update(id: string, userId: string, dto: UpdateAnnotationDto) {
    const annotation = await this.annotationRepository.findById(id);
    if (!annotation) throw new NotFoundException('Annotation not found');
    if (annotation.userId !== userId)
      throw new ForbiddenException('Unauthorized');

    return await this.annotationRepository.update(id, dto);
  }

  async remove(id: string, userId: string) {
    const annotation = await this.annotationRepository.findById(id);
    if (!annotation) throw new NotFoundException('Annotation not found');
    if (annotation.userId !== userId)
      throw new ForbiddenException('Unauthorized');

    await this.annotationRepository.delete(id);
    return { message: 'Annotation deleted successfully' };
  }
}
