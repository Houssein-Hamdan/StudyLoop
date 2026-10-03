import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';
import { CreateTopicDto } from './dto/create-lesson.dto.js';
import { LESSON_REPOSITORY } from './repositories/lesson.repository.interface.js';
import { TOPIC_REPOSITORY } from './repositories/topic.repository.interface.js';
import { CONTAINER_REPOSITORY } from '../container/repositories/container.repository.interface.js';
import { PROGRESS_REPOSITORY } from '../progress/repositories/progress.repository.interface.js';
import { GeminiService } from '../gemini/gemini.service.js';

import type { ILessonRepository } from './repositories/lesson.repository.interface.js';
import type { ITopicRepository } from './repositories/topic.repository.interface.js';
import type { IContainerRepository } from '../container/repositories/container.repository.interface.js';
import type { IProgressRepository } from '../progress/repositories/progress.repository.interface.js';
import {
  LessonNotFoundException,
  TopicNotFoundException,
  UnauthorizedLessonAccessException,
} from '../../exceptions/auth.exceptions.js';

import { randomUUID } from 'node:crypto';

@Injectable()
export class LessonService {
  constructor(
    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,

    @Inject(TOPIC_REPOSITORY)
    private readonly topicRepository: ITopicRepository,

    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepository: IContainerRepository,

    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: IProgressRepository,

    private readonly geminiService: GeminiService,
  ) {}

  /**
   * Create a new lesson with topics.
   * Supports structured topics OR raw content.
   */
  async createLesson(
    containerId: string,
    userId: string,
    createLessonDto: CreateLessonDto,
  ) {
    const { title, topics, rawContent } = createLessonDto;

    // 1. Check container ownership
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );

    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }

    // 2. Validate input mode
    const hasTopics = !!topics?.length;
    const hasRawContent = !!rawContent?.trim();

    if (hasTopics && hasRawContent) {
      throw new BadRequestException(
        'Provide either topics or rawContent, not both',
      );
    }

    // 3. Prepare topics
    let topicsToSave = topics ?? [];

    if (hasRawContent) {
      const parsed = await this.geminiService.parseUnstructuredText(
        rawContent!,
      );

      topicsToSave = parsed.map((topic) => ({
        title: topic.title,
        description: topic.description ?? null,
      }));
    }

    // 5. Create Lesson + Topics atomically
    const lesson = await this.lessonRepository.createWithTopics(
      {
        title,
        containerId,
      },
      topicsToSave.map((topic) => ({
        title: topic.title,
        description: topic.description,
      })),
    );

    return {
      message: 'Lesson created successfully',
      lesson: this.formatLesson(lesson),
    };
  }

  async createTopic(
    lessonId: string,
    containerId: string,
    userId: string,
    createTopicDto: CreateTopicDto,
  ) {
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

    const topic = await this.topicRepository.create({
      lessonId,
      title: createTopicDto.title,
      description: createTopicDto.description ?? null,
    });

    const progressRecords =
      await this.progressRepository.findByLessonId(lessonId);

    await Promise.all(
      progressRecords.map((progress) => {
        const totalTopicsCount = progress.totalTopicsCount + 1;

        const completionPercentage =
          totalTopicsCount > 0
            ? Math.round(
                (progress.completedTopicsCount / totalTopicsCount) * 100,
              )
            : 0;

        return this.progressRepository.update(progress.id, {
          totalTopicsCount,
          completionPercentage,
          isLessonCompleted: false,
        });
      }),
    );

    return {
      message: 'Topic created successfully',
      topic: this.formatTopic(topic),
    };
  }

  /**
   * Get all lessons in a container
   */
  async getLessonsByContainer(containerId: string, userId: string) {
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );

    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }

    const lessons =
      await this.lessonRepository.findAllByContainerId(containerId);

    return {
      message: 'Lessons retrieved successfully',
      count: lessons.length,
      lessons: lessons.map((lesson) => this.formatLesson(lesson)),
    };
  }

  /**
   * Get a specific lesson
   */
  async getLesson(lessonId: string, containerId: string, userId: string) {
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

    return {
      message: 'Lesson retrieved successfully',
      lesson: this.formatLesson(lesson),
    };
  }

  /**
   * Update lesson
   */
  async updateLesson(
    lessonId: string,
    containerId: string,
    userId: string,
    updateLessonDto: UpdateLessonDto,
  ) {
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

    const updatedLesson = await this.lessonRepository.update(
      lessonId,
      updateLessonDto,
    );

    return {
      message: 'Lesson updated successfully',
      lesson: this.formatLesson(updatedLesson),
    };
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId: string, containerId: string, userId: string) {
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

    const deleted = await this.lessonRepository.delete(lessonId);

    if (!deleted) {
      throw new LessonNotFoundException();
    }

    return {
      message: 'Lesson deleted successfully',
    };
  }

  /**
   * Update a topic
   */
  async updateTopic(
    topicId: string,
    lessonId: string,
    containerId: string,
    userId: string,
    updateTopicDto: UpdateTopicDto,
  ) {
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

    const topic = await this.topicRepository.findByIdAndLessonId(
      topicId,
      lessonId,
    );

    if (!topic) {
      throw new TopicNotFoundException();
    }

    const updatedTopic = await this.topicRepository.update(
      topicId,
      updateTopicDto,
    );

    return {
      message: 'Topic updated successfully',
      topic: this.formatTopic(updatedTopic),
    };
  }

  /**
   * Delete a topic
   */
  async deleteTopic(
    topicId: string,
    lessonId: string,
    containerId: string,
    userId: string,
  ) {
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

    const topic = await this.topicRepository.findByIdAndLessonId(
      topicId,
      lessonId,
    );

    if (!topic) {
      throw new TopicNotFoundException();
    }

    const deleted = await this.topicRepository.delete(topicId);

    if (!deleted) {
      throw new TopicNotFoundException();
    }

    return {
      message: 'Topic deleted successfully',
    };
  }

  /**
   * Format lesson response
   */
  private formatLesson(lesson: any) {
    return {
      id: lesson.id,
      title: lesson.title,
      topics: lesson.topics
        ? lesson.topics.map((topic: any) => this.formatTopic(topic))
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
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    };
  }

  /**
   * Parse raw text into structured topics
   */
  async parseRawText(rawContent: string) {
    if (!rawContent || !rawContent.trim()) {
      throw new BadRequestException('Raw content is required');
    }

    const topics = await this.geminiService.parseUnstructuredText(rawContent);

    return {
      message: 'Raw text parsed successfully',
      topics,
    };
  }

  /**
   * Toggle sharing for a lesson
   */
  async toggleShareStatus(
    lessonId: string,
    containerId: string,
    userId: string,
    isPublic: boolean,
  ) {
    // 1. Check container ownership
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );

    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }

    // 2. Find lesson
    const lesson = await this.lessonRepository.findByIdAndContainerId(
      lessonId,
      containerId,
    );

    if (!lesson) {
      throw new LessonNotFoundException();
    }

    // 3. Generate share token if needed
    let shareToken = lesson.shareToken;

    if (isPublic && !shareToken) {
      shareToken = randomUUID();
    }

    // 4. Save update
    const updatedLesson = await this.lessonRepository.update(lessonId, {
      isPublic,
      shareToken: isPublic ? shareToken : null,
    });

    return {
      message: isPublic
        ? 'Lesson shared successfully'
        : 'Lesson sharing disabled',
      isPublic: updatedLesson.isPublic,
      shareToken: updatedLesson.shareToken,
      shareUrl: updatedLesson.shareToken
        ? `/lessons/share/${updatedLesson.shareToken}`
        : null,
    };
  }

  /**
   * Get a shared lesson by share token
   */
  async getSharedLesson(shareToken: string) {
    if (!shareToken) {
      throw new BadRequestException('Share token is required');
    }

    const lesson = await this.lessonRepository.findByShareToken(shareToken);

    if (!lesson || !lesson.isPublic) {
      throw new LessonNotFoundException();
    }

    return {
      message: 'Shared lesson retrieved successfully',
      lesson: this.formatLesson(lesson),
    };
  }
}
