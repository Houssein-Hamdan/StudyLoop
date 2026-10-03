import { Injectable, Inject } from '@nestjs/common';
import { CreateSummaryDto } from './dto/create-summary.dto.js';
import { Summary, SummaryDepth } from '../../entities/summary.entity.js';
import {
  SUMMARY_REPOSITORY,
  type ISummaryRepository,
} from './repositories/summary.repository.interface.js';
import {
  LESSON_REPOSITORY,
  type ILessonRepository,
} from '../lesson/repositories/lesson.repository.interface.js';
import {
  CONTAINER_REPOSITORY,
  type IContainerRepository,
} from '../container/repositories/container.repository.interface.js';
import { SummarizationService } from './summarization.service.js';
import {
  LessonNotFoundException,
  UnauthorizedLessonAccessException,
  SummaryNotFoundException,
} from '../../exceptions/auth.exceptions.js';

@Injectable()
export class SummaryService {
  constructor(
    @Inject(SUMMARY_REPOSITORY)
    private readonly summaryRepository: ISummaryRepository,

    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,

    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepository: IContainerRepository,

    private readonly summarizationService: SummarizationService,
  ) {}

  /**
   * Create and generate a summary
   */
  async createSummary(
    userId: string,
    containerId: string,
    lessonId: string,
    createSummaryDto: CreateSummaryDto,
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

    let topicsToSummarize = lesson.topics;

    if (createSummaryDto.selectedTopicIds) {
      const selectedTopics = lesson.topics.filter((topic) =>
        createSummaryDto.selectedTopicIds!.includes(topic.id),
      );

      if (selectedTopics.length !== createSummaryDto.selectedTopicIds.length) {
        throw new UnauthorizedLessonAccessException();
      }

      topicsToSummarize = selectedTopics;
    }

    const existingSummary = await this.summaryRepository.findByLessonIdAndDepth(
      lessonId,
      createSummaryDto.depth,
    );

    if (existingSummary) {
      return {
        message: 'Summary retrieved successfully',
        summary: this.formatSummary(existingSummary),
      };
    }

    const content = await this.summarizationService.generateSummary(
      topicsToSummarize,
      createSummaryDto.depth,
    );

    const summary = await this.summaryRepository.create({
      lessonId,
      content,
      depth: createSummaryDto.depth as SummaryDepth,
      selectedTopicIds: createSummaryDto.selectedTopicIds
        ? JSON.stringify(createSummaryDto.selectedTopicIds)
        : undefined,
    });

    return {
      message: 'Summary generated and saved successfully',
      summary: this.formatSummary(summary),
    };
  }

  /**
   * Get summaries for a lesson
   */
  async getSummaries(lessonId: string, containerId: string, userId: string) {
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

    const summaries = await this.summaryRepository.findByLessonId(lessonId);

    return {
      message: 'Summaries retrieved successfully',
      count: summaries.length,
      summaries: summaries.map((s) => this.formatSummary(s)),
    };
  }

  /**
   * Get a specific summary
   */
  async getSummary(
    summaryId: string,
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

    const summary = await this.summaryRepository.findById(summaryId);
    if (!summary || summary.lessonId !== lessonId) {
      throw new SummaryNotFoundException();
    }

    return {
      message: 'Summary retrieved successfully',
      summary: this.formatSummary(summary),
    };
  }

  /**
   * Delete a summary
   */
  async deleteSummary(
    summaryId: string,
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

    const summary = await this.summaryRepository.findById(summaryId);
    if (!summary || summary.lessonId !== lessonId) {
      throw new SummaryNotFoundException();
    }

    const deleted = await this.summaryRepository.delete(summaryId);
    if (!deleted) {
      throw new SummaryNotFoundException();
    }

    return {
      message: 'Summary deleted successfully',
    };
  }

  /**
   * Format summary response
   */
  private formatSummary(summary: any) {
    return {
      id: summary.id,
      lessonId: summary.lessonId,
      depth: summary.depth,
      content: summary.content,
      selectedTopicIds: summary.selectedTopicIds
        ? typeof summary.selectedTopicIds === 'string'
          ? JSON.parse(summary.selectedTopicIds)
          : summary.selectedTopicIds
        : null,
      createdAt: summary.createdAt,
      updatedAt: summary.updatedAt,
    };
  }
}
