import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Annotation } from '../../../entities/annotation.entity.js';
import { IAnnotationRepository } from './annotation.repository.interface.js';

@Injectable()
export class AnnotationRepository implements IAnnotationRepository {
  constructor(
    @InjectRepository(Annotation)
    private readonly repository: Repository<Annotation>,
  ) {}

  async create(data: Partial<Annotation>): Promise<Annotation> {
    const annotation = this.repository.create(data);
    return await this.repository.save(annotation);
  }

  async findByLessonAndUser(
    lessonId: string,
    userId: string,
  ): Promise<Annotation[]> {
    return await this.repository.find({
      where: { lessonId, userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Annotation | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    data: Partial<Annotation>,
  ): Promise<Annotation | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
  async countByUserId(userId: string): Promise<number> {
    return await this.repository.count({ where: { userId } });
  }
}
