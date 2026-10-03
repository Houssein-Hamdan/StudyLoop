import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lesson } from '../../../entities/lesson.entity.js';
import { Topic } from '../../../entities/topic.entity.js';
import { Progress } from '../../../entities/progress.entity.js';
import { UserTopicProgress } from '../../../entities/user-topic-progress.entity.js';

import type { SearchLessonDto } from '../dto/search-lesson.dto.js';
import type { SearchTopicDto } from '../dto/search-topic.dto.js';
import type { ISearchRepository } from './search.repository.interface.js';

@Injectable()
export class SearchRepository implements ISearchRepository {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,

    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async searchLessonsByContainer(
    userId: string,
    containerId: string,
    filters: SearchLessonDto,
  ): Promise<{ lessons: Lesson[]; total: number }> {
    const skip = filters.skip ?? 0;
    const take = filters.take ?? 10;

    let query = this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.topics', 'topic')
      .leftJoinAndSelect('lesson.container', 'container')
      .leftJoin(
        Progress,
        'progress',
        'progress.lessonId = lesson.id AND progress.userId = :userId',
        { userId },
      )
      .addSelect('COALESCE(progress.completionPercentage, 0)', 'completion_percentage')
      .where('lesson.containerId = :containerId', { containerId });

    if (filters.query) {
      query = query.andWhere(
        '(lesson.title ILIKE :query OR topic.title ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'mastered') {
        query = query.andWhere('progress.isLessonCompleted = :isCompleted', {
          isCompleted: true,
        });
      }

      if (filters.status === 'in_progress') {
        query = query.andWhere(
          'progress.id IS NOT NULL AND progress.isLessonCompleted = :isCompleted',
          { isCompleted: false },
        );
      }
    }

    if (filters.sortBy === 'newest') {
      query = query.orderBy('lesson.createdAt', 'DESC');
    } else if (filters.sortBy === 'oldest') {
      query = query.orderBy('lesson.createdAt', 'ASC');
    } else if (filters.sortBy === 'most_completed') {
      query = query.orderBy('completion_percentage', 'DESC');
    }

    query = query.skip(skip).take(take);

    const [lessons, total] = await query.getManyAndCount();

    return { lessons, total };
  }

  async searchLessonsAcrossContainers(
    userId: string,
    filters: SearchLessonDto,
  ): Promise<{ lessons: Lesson[]; total: number }> {
    const skip = filters.skip ?? 0;
    const take = filters.take ?? 10;

    let query = this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.topics', 'topic')
      .leftJoinAndSelect('lesson.container', 'container')
      .leftJoin(
        Progress,
        'progress',
        'progress.lessonId = lesson.id AND progress.userId = :userId',
        { userId },
      )
      .addSelect('COALESCE(progress.completionPercentage, 0)', 'completion_percentage')
      .where('container.userId = :userId', { userId });

    if (filters.query) {
      query = query.andWhere(
        '(lesson.title ILIKE :query OR topic.title ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'mastered') {
        query = query.andWhere('progress.isLessonCompleted = :isCompleted', {
          isCompleted: true,
        });
      }

      if (filters.status === 'in_progress') {
        query = query.andWhere(
          'progress.id IS NOT NULL AND progress.isLessonCompleted = :isCompleted',
          { isCompleted: false },
        );
      }
    }

    if (filters.sortBy === 'newest') {
      query = query.orderBy('lesson.createdAt', 'DESC');
    } else if (filters.sortBy === 'oldest') {
      query = query.orderBy('lesson.createdAt', 'ASC');
    } else if (filters.sortBy === 'most_completed') {
      query = query.orderBy('completion_percentage', 'DESC');
    }

    query = query.skip(skip).take(take);

    const [lessons, total] = await query.getManyAndCount();

    return { lessons, total };
  }

  async searchTopicsInLesson(
    userId: string,
    lessonId: string,
    filters: SearchTopicDto,
  ): Promise<{ topics: Topic[]; total: number }> {
    const skip = filters.skip ?? 0;
    const take = filters.take ?? 20;

    let query = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.lesson', 'lesson')
      .leftJoin(
        UserTopicProgress,
        'topicProgress',
        'topicProgress.topicId = topic.id AND topicProgress.userId = :userId',
        { userId },
      )
      .where('topic.lessonId = :lessonId', { lessonId });

    if (filters.query) {
      query = query.andWhere(
        '(topic.title ILIKE :query OR topic.description ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'completed') {
        query = query.andWhere('topicProgress.isCompleted = :isCompleted', {
          isCompleted: true,
        });
      }

      if (filters.status === 'not_completed') {
        query = query.andWhere(
          '(topicProgress.id IS NULL OR topicProgress.isCompleted = :isCompleted)',
          { isCompleted: false },
        );
      }
    }

    if (filters.sortBy === 'newest') {
      query = query.orderBy('topic.createdAt', 'DESC');
    } else if (filters.sortBy === 'oldest') {
      query = query.orderBy('topic.createdAt', 'ASC');
    }

    query = query.skip(skip).take(take);

    const [topics, total] = await query.getManyAndCount();

    return { topics, total };
  }

  async searchTopicsAcrossLessons(
    userId: string,
    containerId: string,
    filters: SearchTopicDto,
  ): Promise<{ topics: Topic[]; total: number }> {
    const skip = filters.skip ?? 0;
    const take = filters.take ?? 20;

    let query = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.lesson', 'lesson')
      .leftJoin(
        UserTopicProgress,
        'topicProgress',
        'topicProgress.topicId = topic.id AND topicProgress.userId = :userId',
        { userId },
      )
      .where('lesson.containerId = :containerId', { containerId });

    if (filters.query) {
      query = query.andWhere(
        '(topic.title ILIKE :query OR topic.description ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'completed') {
        query = query.andWhere('topicProgress.isCompleted = :isCompleted', {
          isCompleted: true,
        });
      }

      if (filters.status === 'not_completed') {
        query = query.andWhere(
          '(topicProgress.id IS NULL OR topicProgress.isCompleted = :isCompleted)',
          { isCompleted: false },
        );
      }
    }

    if (filters.sortBy === 'newest') {
      query = query.orderBy('topic.createdAt', 'DESC');
    } else if (filters.sortBy === 'oldest') {
      query = query.orderBy('topic.createdAt', 'ASC');
    }

    query = query.skip(skip).take(take);

    const [topics, total] = await query.getManyAndCount();

    return { topics, total };
  }
}