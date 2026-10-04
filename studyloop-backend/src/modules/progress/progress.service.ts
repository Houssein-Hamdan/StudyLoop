import { Injectable, Inject } from '@nestjs/common';
import { UpdateProgressDto } from './dto/update-progress.dto.js';
import {
  PROGRESS_REPOSITORY,
  type IProgressRepository,
} from './repositories/progress.repository.interface.js';
import {
  LESSON_REPOSITORY,
  type ILessonRepository,
} from '../lesson/repositories/lesson.repository.interface.js';
import {
  CONTAINER_REPOSITORY,
  type IContainerRepository,
} from '../container/repositories/container.repository.interface.js';
import {
  TOPIC_REPOSITORY,
  type ITopicRepository,
} from '../lesson/repositories/topic.repository.interface.js';
import {
  LessonNotFoundException,
  UnauthorizedLessonAccessException,
  ProgressNotFoundException,
  TopicNotFoundException,
} from '../../exceptions/auth.exceptions.js';
import {
  USER_TOPIC_PROGRESS_REPOSITORY,
  type IUserTopicProgressRepository,
} from './repositories/user-topic-progress.repository.interface.js';
import { UpdateTopicProgressDto } from './dto/update-topic-progress.dto.js';
import { Progress } from '../../entities/progress.entity.js';

@Injectable()
export class ProgressService {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: IProgressRepository,
    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,
    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepository: IContainerRepository,
    @Inject(USER_TOPIC_PROGRESS_REPOSITORY)
    private readonly userTopicProgressRepository: IUserTopicProgressRepository,
    @Inject(TOPIC_REPOSITORY)
    private readonly topicRepository: ITopicRepository,
  ) {}

  /**
   * Get or create progress record for user and lesson
   * @param userId - User ID
   * @param containerId - Container ID
   * @param lessonId - Lesson ID
   * @returns Progress record
   */
  async getOrCreateProgress(
    userId: string,
    containerId: string,
    lessonId: string,
  ) {
    // Verify container ownership
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );
    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }

    // Verify lesson exists
    const lesson = await this.lessonRepository.findByIdAndContainerId(
      lessonId,
      containerId,
    );

    if (!lesson) {
      throw new LessonNotFoundException();
    }

    // Find existing progress
    let progress = await this.progressRepository.findByUserAndLesson(
      userId,
      lessonId,
    );

    // Create if doesn't exist
    if (!progress) {
      progress = await this.progressRepository.create({
        userId,
        lessonId,
        totalTopicsCount: lesson.topics.length,
        completedTopicsCount: 0,
        completionPercentage: 0,
        isLessonCompleted: lesson.topics.length === 0,
      });
    }

    return {
      message: 'Progress retrieved successfully',
      progress: this.formatProgress(progress),
    };
  }

  /**
   * Update progress ( , completion status)
   * @param userId - User ID
   * @param containerId - Container ID
   * @param lessonId - Lesson ID
   * @param updateProgressDto - Updated data
   * @returns Updated progress
   */
  async updateProgress(
    userId: string,
    containerId: string,
    lessonId: string,
    updateProgressDto: UpdateProgressDto,
  ) {
    // Verify container ownership
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );
    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }

    // Get lesson with topics
    const lesson = await this.lessonRepository.findByIdAndContainerId(
      lessonId,
      containerId,
    );
    if (!lesson) {
      throw new LessonNotFoundException();
    }

    // Get progress
    let progress = await this.progressRepository.findByUserAndLesson(
      userId,
      lessonId,
    );
    if (!progress) {
      progress = await this.progressRepository.create({
        userId,
        lessonId,
        totalTopicsCount: lesson.topics.length,
        completedTopicsCount: 0,
        completionPercentage: 0,
      });
    }

    // Calculate completed topics
    const calculatedProgress = await this.calculateLessonProgress(
      userId,
      lessonId,
      lesson.topics.length,
    );

    // Update progress
    const updatedProgress = await this.progressRepository.update(progress.id, {
      scrollPosition:
        updateProgressDto.scrollPosition ?? progress.scrollPosition,

      totalTopicsCount: calculatedProgress.totalTopics,

      completedTopicsCount: calculatedProgress.completedTopics,

      completionPercentage: calculatedProgress.completionPercentage,

      isLessonCompleted: calculatedProgress.isLessonCompleted,
    });

    return {
      message: 'Progress updated successfully',
      progress: this.formatProgress(updatedProgress),
    };
  }

  /**
   * Get user's overall progress statistics
   * @param userId - User ID
   * @returns Overall stats
   */
  async getUserStats(userId: string) {
    const totalLessons = await this.lessonRepository.countByUserId(userId);
    const totalTopics = await this.topicRepository.countByUserId(userId);
    const totalCompleted =
      await this.topicRepository.countCompletedByUserId(userId);

    const averageCompletion =
      totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

    const stats = await this.progressRepository.getOverallStats(userId);
    const completedLessons = stats?.completedLessons ?? 0;

    return {
      message: 'User statistics retrieved successfully',
      stats: {
        totalLessons,
        completedLessons,
        totalTopics,
        totalCompleted,
        averageCompletion,
        lessonsInProgress: Math.max(0, totalLessons - completedLessons),
      },
    };
  }

  /**
   * Get all progress for a user
   * @param userId - User ID
   * @returns List of progress records
   */
  async getUserProgress(userId: string) {
    const allProgress = await this.progressRepository.findByUserId(userId);

    return {
      message: 'User progress retrieved successfully',
      count: allProgress.length,
      progress: allProgress.map((progress) => this.formatProgress(progress)),
    };
  }

  /**
   * Get progress for a specific lesson
   * @param userId - User ID
   * @param containerId - Container ID
   * @param lessonId - Lesson ID
   * @returns Progress record
   */
  async getLessonProgress(
    userId: string,
    containerId: string,
    lessonId: string,
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

    const progress = await this.progressRepository.findByUserAndLesson(
      userId,
      lessonId,
    );

    if (!progress) {
      throw new ProgressNotFoundException();
    }

    const topicProgress =
      await this.userTopicProgressRepository.findByUserAndLesson(
        userId,
        lessonId,
      );

    return {
      message: 'Lesson progress retrieved successfully',
      progress: this.formatProgress(progress),
      topicProgress: topicProgress.map((item) => ({
        id: item.id,
        topicId: item.topicId,
        isCompleted: item.isCompleted,
        completedAt: item.completedAt,
      })),
    };
  }

  /**
   * Format progress response
   */
  private formatProgress(progress: Progress) {
    return {
      id: progress.id,
      lessonId: progress.lessonId,
      userId: progress.userId,

      completedTopicsCount: progress.completedTopicsCount,
      totalTopicsCount: progress.totalTopicsCount,
      completionPercentage: progress.completionPercentage,
      scrollPosition: progress.scrollPosition,
      isLessonCompleted: progress.isLessonCompleted,

      lastReviewedAt: progress.lastReviewedAt,
      nextReviewDate: progress.nextReviewDate,
      reviewCount: progress.reviewCount,
      reviewIntervalDays: progress.reviewIntervalDays,

      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }

  async updateTopicProgress(
    userId: string,
    containerId: string,
    lessonId: string,
    topicId: string,
    updateTopicProgressDto: UpdateTopicProgressDto,
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

    let topicProgress =
      await this.userTopicProgressRepository.findByUserAndTopic(
        userId,
        topicId,
      );

    const isCompleted = updateTopicProgressDto.isCompleted;
    const completedAt = isCompleted ? new Date() : null;

    if (!topicProgress) {
      topicProgress = await this.userTopicProgressRepository.create({
        userId,
        topicId,
        isCompleted,
        completedAt,
      });
    } else {
      topicProgress = await this.userTopicProgressRepository.update(
        topicProgress.id,
        {
          isCompleted,
          completedAt,
        },
      );
    }

    let progress = await this.progressRepository.findByUserAndLesson(
      userId,
      lessonId,
    );

    if (!progress) {
      progress = await this.progressRepository.create({
        userId,
        lessonId,
        totalTopicsCount: lesson.topics.length,
        completedTopicsCount: 0,
        completionPercentage: 0,
        isLessonCompleted: false,
      });
    }

    const calculatedProgress = await this.calculateLessonProgress(
      userId,
      lessonId,
      lesson.topics.length,
    );

    const updatedProgress = await this.progressRepository.update(progress.id, {
      totalTopicsCount: calculatedProgress.totalTopics,
      completedTopicsCount: calculatedProgress.completedTopics,
      completionPercentage: calculatedProgress.completionPercentage,
      isLessonCompleted: calculatedProgress.isLessonCompleted,
    });

    return {
      message: 'Topic progress updated successfully',
      topicProgress: {
        id: topicProgress.id,
        topicId: topicProgress.topicId,
        isCompleted: topicProgress.isCompleted,
        completedAt: topicProgress.completedAt,
      },
      progress: this.formatProgress(updatedProgress),
    };
  }

  // progress.service.ts

  /**
   * Complete a review session for a lesson and schedule the next one
   */
  async completeReview(userId: string, containerId: string, lessonId: string) {
    // 1. Verify container ownership
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

    // 2. Get progress
    let progress = await this.progressRepository.findByUserAndLesson(
      userId,
      lessonId,
    );
    if (!progress) {
      throw new ProgressNotFoundException();
    }

    // 3. Calculate Spaced Repetition Interval
    const newReviewCount = (progress.reviewCount || 0) + 1;
    const intervalDays = this.calculateNextInterval(newReviewCount);

    const now = new Date();
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(now.getDate() + intervalDays);

    // 4. Update progress record
    const updatedProgress = await this.progressRepository.update(progress.id, {
      lastReviewedAt: now,
      nextReviewDate,
      reviewCount: newReviewCount,
      reviewIntervalDays: intervalDays,
    });

    return {
      message: 'Review completed and next review scheduled successfully',
      progress: this.formatProgress(updatedProgress),
    };
  }

  /**
   * Get all lessons due for review today
   */
  async getDueReviews(userId: string) {
    const dueReviews = await this.progressRepository.findDueReviews(
      userId,
      new Date(),
    );

    const reviews = await Promise.all(
      dueReviews.map(async (progress: any) => {
        const lesson = await this.lessonRepository.findById(progress.lessonId);

        return {
          ...this.formatProgress(progress),

          lesson: lesson
            ? {
                id: lesson.id,
                title: lesson.title,
                containerId: lesson.containerId,
              }
            : null,
        };
      }),
    );

    return {
      message: 'Due reviews retrieved successfully',
      count: reviews.length,
      reviews,
    };
  }

  /**
   * Simple Spaced Repetition Interval Calculator (Days: 1 -> 3 -> 7 -> 14 -> 30 -> 60)
   */
  private calculateNextInterval(reviewCount: number): number {
    const intervals = [1, 3, 7, 14, 30, 60];
    if (reviewCount <= intervals.length) {
      return intervals[reviewCount - 1];
    }
    return 60;
  }

  private async calculateLessonProgress(
    userId: string,
    lessonId: string,
    totalTopics: number,
  ) {
    const topicProgress =
      await this.userTopicProgressRepository.findByUserAndLesson(
        userId,
        lessonId,
      );

    const completedTopics = topicProgress.filter(
      (progress) => progress.isCompleted,
    ).length;

    const completionPercentage =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      totalTopics,
      completedTopics,
      completionPercentage,
      isLessonCompleted: totalTopics === 0 || completedTopics === totalTopics,
    };
  }
}
