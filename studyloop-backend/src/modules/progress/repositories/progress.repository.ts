import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from '../../../entities/progress.entity.js';
import { IProgressRepository } from './progress.repository.interface.js';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class ProgressRepository implements IProgressRepository {
  constructor(
    @InjectRepository(Progress)
    private readonly repository: Repository<Progress>,
  ) {}

  async findByUserAndLesson(
    userId: string,
    lessonId: string,
  ): Promise<Progress | null> {
    return this.repository.findOne({
      where: { userId, lessonId },
      relations: { lesson: true },
    });
  }

  async findByUserId(userId: string): Promise<Progress[]> {
    return this.repository.find({
      where: { userId },
      relations: { lesson: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async findByLessonId(lessonId: string): Promise<Progress[]> {
    return this.repository.find({
      where: { lessonId },
    });
  }

  async create(progress: Partial<Progress>): Promise<Progress> {
    const newProgress = this.repository.create(progress);
    return this.repository.save(newProgress);
  }

  async update(id: string, progress: Partial<Progress>): Promise<Progress> {
    await this.repository.update(id, progress);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Progress with id ${id} not found`);
    }
    return updated;
  }

  async getOverallStats(userId: string): Promise<any> {
    const allProgress = await this.repository.find({
      where: { userId },
    });

    const totalLessons = allProgress.length;
    const completedLessons = allProgress.filter(
      (p) => p.isLessonCompleted,
    ).length;
    const totalCompleted = allProgress.reduce(
      (sum, p) => sum + p.completedTopicsCount,
      0,
    );
    const totalTopics = allProgress.reduce(
      (sum, p) => sum + p.totalTopicsCount,
      0,
    );
    const averageCompletion =
      totalLessons > 0
        ? allProgress.reduce((sum, p) => sum + p.completionPercentage, 0) /
          totalLessons
        : 0;

    return {
      totalLessons,
      completedLessons,
      totalCompleted,
      totalTopics,
      averageCompletion: Math.round(averageCompletion),
    };
  }
  async findDueReviews(
    userId: string,
    currentDate: Date = new Date(),
  ): Promise<Progress[]> {
    return this.repository.find({
      where: {
        userId,
        nextReviewDate: LessThanOrEqual(currentDate),
      },
      relations: { lesson: true },
    });
  }
}
