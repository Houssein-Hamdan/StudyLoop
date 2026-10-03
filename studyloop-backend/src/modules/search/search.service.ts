import { Injectable, Inject } from '@nestjs/common';
import type { SearchLessonDto } from './dto/search-lesson.dto.js';
import type { SearchTopicDto } from './dto/search-topic.dto.js';
import {
  SEARCH_REPOSITORY,
  type ISearchRepository,
} from './repositories/search.repository.interface.js';
import {
  CONTAINER_REPOSITORY,
  type IContainerRepository,
} from '../container/repositories/container.repository.interface.js';
import {
  LESSON_REPOSITORY,
  type ILessonRepository,
} from '../lesson/repositories/lesson.repository.interface.js';
import {
  LessonNotFoundException,
  UnauthorizedLessonAccessException,
} from '../../exceptions/auth.exceptions.js';

@Injectable()
export class SearchService {
  constructor(
    @Inject(SEARCH_REPOSITORY)
    private readonly searchRepository: ISearchRepository,
    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepository: IContainerRepository,
    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  /**
   * Search lessons in a specific container
   */
  async searchLessonsInContainer(
    userId: string,
    containerId: string,
    filters: SearchLessonDto,
  ) {
    // Verify container ownership
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );
    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }

    const { lessons, total } =
      await this.searchRepository.searchLessonsByContainer(
        userId,
        containerId,
        filters,
      );

    return {
      message: 'Lessons search completed successfully',
      total,
      count: lessons.length,
      lessons: lessons.map((lesson) => this.formatLesson(lesson)),
    };
  }

  /**
   * Search lessons across all user containers
   */
  async searchLessonsAcrossContainers(
    userId: string,
    filters: SearchLessonDto,
  ) {
    const { lessons, total } =
      await this.searchRepository.searchLessonsAcrossContainers(
        userId,
        filters,
      );

    return {
      message: 'Global lesson search completed successfully',
      total,
      count: lessons.length,
      lessons: lessons.map((lesson) => this.formatLesson(lesson)),
    };
  }

  /**
   * Search topics in a specific lesson
   */
  async searchTopicsInLesson(
    userId: string,
    containerId: string,
    lessonId: string,
    filters: SearchTopicDto,
  ) {
    // Verify container ownership
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );
    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }
    const lesson = await this.lessonRepository.findByIdAndContainerId(
      lessonId,
      containerId,
    );

    if (!lesson) {
      throw new LessonNotFoundException();
    }

    const { topics, total } = await this.searchRepository.searchTopicsInLesson(
      userId,
      lessonId,
      filters,
    );

    return {
      message: 'Topics search completed successfully',
      total,
      count: topics.length,
      topics: topics.map((topic) => this.formatTopic(topic)),
    };
  }

  /**
   * Search topics across all lessons in a container
   */
  async searchTopicsAcrossLessons(
    userId: string,
    containerId: string,
    filters: SearchTopicDto,
  ) {
    // Verify container ownership
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );
    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }

    const { topics, total } =
      await this.searchRepository.searchTopicsAcrossLessons(
        userId,
        containerId,
        filters,
      );
    return {
      message: 'Global topic search completed successfully',
      total,
      count: topics.length,
      topics: topics.map((topic) => this.formatTopic(topic)),
    };
  }

  /**
   * Format lesson response
   */
  private formatLesson(lesson: any) {
    const containerId = lesson.containerId || lesson.container?.id;

    return {
      id: lesson.id,
      title: lesson.title,
      containerId: containerId, // 👈 إرجاع المعرف بشكل مباشر
      container: lesson.container
        ? {
            id: lesson.container.id,
            name: lesson.container.name,
          }
        : undefined,
      topicsCount: lesson.topics ? lesson.topics.length : 0,
      topics: lesson.topics
        ? lesson.topics.map((t: any) => ({
            id: t.id,
            title: t.title,
          }))
        : [],
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }

  /**
   * Format topic response
   */
  private formatTopic(topic: any) {
    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      lessonTitle: topic.lesson ? topic.lesson.title : null,
      lessonId: topic.lessonId,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    };
  }
}