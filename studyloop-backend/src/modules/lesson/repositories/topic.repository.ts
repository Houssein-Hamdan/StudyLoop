import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '../../../entities/topic.entity.js';
import type { ITopicRepository } from './topic.repository.interface.js';
import { UserTopicProgress } from '../../../entities/user-topic-progress.entity.js';


@Injectable()
export class TopicRepository implements ITopicRepository {
  constructor(
    @InjectRepository(Topic)
    private readonly repository: Repository<Topic>,
  ) {}

  async findById(id: string): Promise<Topic | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdAndLessonId(
    id: string,
    lessonId: string,
  ): Promise<Topic | null> {
    return this.repository.findOne({ where: { id, lessonId } });
  }

  async findAllByLessonId(lessonId: string): Promise<Topic[]> {
    return this.repository.find({ where: { lessonId } });
  }

  async create(topic: Partial<Topic>): Promise<Topic> {
    const newTopic = this.repository.create(topic);
    return this.repository.save(newTopic);
  }

  async update(id: string, topic: Partial<Topic>): Promise<Topic> {
    await this.repository.update(id, topic);
    const updatedTopic = await this.repository.findOne({ where: { id } });

    if (!updatedTopic) {
      throw new Error('Topic not found after update');
    }

    return updatedTopic;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async createMany(topics: Partial<Topic>[]): Promise<Topic[]> {
    const newTopics = this.repository.create(topics);
    return this.repository.save(newTopics);
  }
  async countByUserId(userId: string): Promise<number> {
    return await this.repository
      .createQueryBuilder('topic')
      .innerJoin('topic.lesson', 'lesson')
      .innerJoin('lesson.container', 'container')
      .where('container.userId = :userId', { userId })
      .getCount();
  }


async countCompletedByUserId(userId: string): Promise<number> {
  return await this.repository
    .createQueryBuilder('topic')
    .innerJoin('topic.lesson', 'lesson')
    .innerJoin('lesson.container', 'container')
    .innerJoin(
      UserTopicProgress,
      'topicProgress',
      'topicProgress.topicId = topic.id AND topicProgress.userId = :userId',
      { userId },
    )
    .where('container.userId = :userId', { userId })
    .andWhere('topicProgress.isCompleted = true')
    .getCount();
}
}
