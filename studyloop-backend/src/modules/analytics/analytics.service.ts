import { Injectable, Inject } from '@nestjs/common';
import { LESSON_REPOSITORY } from '../lesson/repositories/lesson.repository.interface.js';
import type { ILessonRepository } from '../lesson/repositories/lesson.repository.interface.js';
import { TOPIC_REPOSITORY } from '../lesson/repositories/topic.repository.interface.js';
import type { ITopicRepository } from '../lesson/repositories/topic.repository.interface.js';
import { ANNOTATION_REPOSITORY } from '../annotation/repositories/annotation.repository.interface.js';
import type { IAnnotationRepository } from '../annotation/repositories/annotation.repository.interface.js';
import { QUIZ_REPOSITORY } from '../quiz/repositories/quiz.repository.interface.js';
import type { IQuizRepository } from '../quiz/repositories/quiz.repository.interface.js';
import { PROGRESS_REPOSITORY } from '../progress/repositories/progress.repository.interface.js';
import type { IProgressRepository } from '../progress/repositories/progress.repository.interface.js';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,

    @Inject(TOPIC_REPOSITORY)
    private readonly topicRepository: ITopicRepository,

    @Inject(ANNOTATION_REPOSITORY)
    private readonly annotationRepository: IAnnotationRepository,

    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: IProgressRepository,
  ) {}

  async getUserDashboardOverview(userId: string) {
    // 1. Total Lessons & Global Topics Progress
    const totalLessons = await this.lessonRepository.countByUserId(userId);
    const totalTopics = await this.topicRepository.countByUserId(userId);
    const completedTopics =
      await this.topicRepository.countCompletedByUserId(userId);

    const globalCompletionRate =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const recentLessons = await this.lessonRepository.findRecentByUserId(
      userId,
      5,
    );

    const recentActivity = await Promise.all(
      recentLessons.map(async (lesson) => {
        const progress = await this.progressRepository.findByUserAndLesson(
          userId,
          lesson.id,
        );

        return {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          containerId: lesson.containerId,
          totalTopics: progress?.totalTopicsCount ?? lesson.topics.length,
          completedTopics: progress?.completedTopicsCount ?? 0,
          progressPercentage: progress?.completionPercentage ?? 0,
          lastAccessedAt: lesson.updatedAt,
        };
      }),
    );

    const quizStats = await this.quizRepository.getUserQuizStats(userId);

    const totalAnnotations =
      await this.annotationRepository.countByUserId(userId);

    return {
      overview: {
        totalLessons,
        totalTopics,
        completedTopics,
        globalCompletionRate,
        totalAnnotations,
      },
      recentActivity,
      quizzes: {
        totalTaken: quizStats?.totalTaken ?? 0,
        averageScore: quizStats?.averageScore ?? 0,
      },
    };
  }
}
