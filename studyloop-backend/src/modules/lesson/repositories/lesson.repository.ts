import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , DataSource} from 'typeorm';
import { Lesson } from '../../../entities/lesson.entity.js';
import type { ILessonRepository } from './lesson.repository.interface.js';
import { Topic } from '../../../entities/topic.entity.js';

@Injectable()
export class LessonRepository implements ILessonRepository {
  constructor(
    @InjectRepository(Lesson)
    private readonly repository: Repository<Lesson>,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<Lesson | null> {
    return this.repository.findOne({
      where: { id },
      relations: { topics: true },
    });
  }

  async findByIdAndContainerId(
    id: string,
    containerId: string,
  ): Promise<Lesson | null> {
    return this.repository.findOne({
      where: { id, containerId },
      relations: { topics: true },
    });
  }

  async findAllByContainerId(containerId: string): Promise<Lesson[]> {
    return this.repository.find({
      where: { containerId },
      relations: { topics: true },
    });
  }

  async create(lesson: Partial<Lesson>): Promise<Lesson> {
    const newLesson = this.repository.create(lesson);
    return this.repository.save(newLesson);
  }

  async update(id: string, lesson: Partial<Lesson>): Promise<Lesson> {
    await this.repository.update(id, lesson);
    const updatedLesson = await this.repository.findOne({
      where: { id },
      relations: { topics: true },
    });

    if (!updatedLesson) {
      throw new Error('Lesson not found after update');
    }

    return updatedLesson;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
  async findByShareToken(shareToken: string): Promise<Lesson | null> {
    return await this.repository.findOne({
      where: { shareToken, isPublic: true },
      relations: { topics: true },
    });
  }

  async findRecentByUserId(
    userId: string,
    limit: number = 5,
  ): Promise<Lesson[]> {
    return await this.repository
      .createQueryBuilder('lesson')
      .innerJoin('lesson.container', 'container')
      .where('container.userId = :userId', { userId })
      .leftJoinAndSelect('lesson.topics', 'topics')
      .orderBy('lesson.updatedAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.repository
      .createQueryBuilder('lesson')
      .innerJoin('lesson.container', 'container')
      .where('container.userId = :userId', { userId })
      .getCount();
  }
  async findByIdAndUserId(id: string, userId: string): Promise<Lesson | null> {
    return this.repository
      .createQueryBuilder('lesson')
      .innerJoin('lesson.container', 'container')
      .where('lesson.id = :id', { id })
      .andWhere('container.userId = :userId', { userId })
      .getOne();
  }
  async createWithTopics(
    lessonData: Partial<Lesson>,
    topicsData: Partial<Topic>[],
  ): Promise<Lesson> {
    return this.dataSource.transaction(async (manager : any) => {
      const lesson = manager.create(Lesson, lessonData);

      const savedLesson = await manager.save(Lesson, lesson);

      const topics = topicsData.map((topic) =>
        manager.create(Topic, {
          ...topic,
          lessonId: savedLesson.id,
        }),
      );

      await manager.save(Topic, topics);

      return manager.findOneOrFail(Lesson, {
        where: { id: savedLesson.id },
        relations: {
          topics: true,
        },
      });
    });
  }
}
