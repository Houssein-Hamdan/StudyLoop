import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserTopicProgressRepository } from './user-topic-progress.repository.interface.js';
import { UserTopicProgress } from '../../../entities/user-topic-progress.entity.js';

@Injectable()
export class UserTopicProgressRepository 
  implements IUserTopicProgressRepository {
  constructor(
    @InjectRepository(UserTopicProgress)
    private readonly repository: Repository<UserTopicProgress>,
  ) {}

  async findByUserAndTopic(
    userId: string,
    topicId: string,
  ): Promise<UserTopicProgress | null> {
    return this.repository.findOne({
      where: {
        userId,
        topicId,
      },
    });
  }

  async findByUserAndLesson(
    userId: string,
    lessonId: string,
  ): Promise<UserTopicProgress[]> {
    return this.repository.find({
      where: {
        userId,
        topic: {
          lessonId,
        },
      },
    });
  }

  async create(data: Partial<UserTopicProgress>): Promise<UserTopicProgress> {
    const progress = this.repository.create(data);

    return this.repository.save(progress);
  }

  async update(
    id: string,
    data: Partial<UserTopicProgress>,
  ): Promise<UserTopicProgress> {
    await this.repository.update(id, data);

    return this.repository.findOneByOrFail({ id });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }
}
