import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProgressService } from './progress.service.js';
import {
  UnauthorizedLessonAccessException,
  LessonNotFoundException,
  TopicNotFoundException,
} from '../../exceptions/auth.exceptions.js';

describe('ProgressService', () => {
  let service: ProgressService;

  const progressRepository = {
    findByUserAndLesson: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    getOverallStats: vi.fn(),
    findByUserId: vi.fn(),
    findDueReviews: vi.fn(),
  };

  const lessonRepository = {
    findByIdAndContainerId: vi.fn(),
  };

  const containerRepository = {
    belongsToUser: vi.fn(),
  };

  const userTopicProgressRepository = {
    findByUserAndTopic: vi.fn(),
    findByUserAndLesson: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const topicRepository = {
    findByIdAndLessonId: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new ProgressService(
      progressRepository as any,
      lessonRepository as any,
      containerRepository as any,
      userTopicProgressRepository as any,
      topicRepository as any,
    );
  });

  describe('getOrCreateProgress', () => {
    it('should create progress when it does not exist', async () => {
      const lesson = {
        id: 'lesson-1',
        topics: [
          { id: 'topic-1' },
          { id: 'topic-2' },
        ],
      };

      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue(lesson);

      progressRepository.findByUserAndLesson.mockResolvedValue(null);

      progressRepository.create.mockResolvedValue({
        id: 'progress-1',
        userId: 'user-1',
        lessonId: 'lesson-1',
        totalTopicsCount: 2,
        completedTopicsCount: 0,
        completionPercentage: 0,
        scrollPosition: 0,
        isLessonCompleted: false,
      });

      const result = await service.getOrCreateProgress(
        'user-1',
        'container-1',
        'lesson-1',
      );

      expect(progressRepository.create).toHaveBeenCalledWith({
        userId: 'user-1',
        lessonId: 'lesson-1',
        totalTopicsCount: 2,
        completedTopicsCount: 0,
        completionPercentage: 0,
        isLessonCompleted: false,
      });

      expect(result.progress.totalTopicsCount).toBe(2);
    });

    it('should reject access when container does not belong to user', async () => {
      containerRepository.belongsToUser.mockResolvedValue(false);

      await expect(
        service.getOrCreateProgress(
          'user-1',
          'container-1',
          'lesson-1',
        ),
      ).rejects.toThrow(UnauthorizedLessonAccessException);

      expect(
        lessonRepository.findByIdAndContainerId,
      ).not.toHaveBeenCalled();
    });
  });

  describe('updateTopicProgress', () => {
    it('should complete a topic and recalculate lesson progress', async () => {
      const lesson = {
        id: 'lesson-1',
        topics: [
          { id: 'topic-1' },
          { id: 'topic-2' },
        ],
      };

      const topic = {
        id: 'topic-1',
        lessonId: 'lesson-1',
      };

      const existingProgress = {
        id: 'progress-1',
        userId: 'user-1',
        lessonId: 'lesson-1',
        totalTopicsCount: 2,
        completedTopicsCount: 0,
        completionPercentage: 0,
        scrollPosition: 0,
        isLessonCompleted: false,
      };

      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue(lesson);

      topicRepository.findByIdAndLessonId.mockResolvedValue(topic);

      userTopicProgressRepository.findByUserAndTopic.mockResolvedValue(null);

      userTopicProgressRepository.create.mockResolvedValue({
        id: 'topic-progress-1',
        topicId: 'topic-1',
        isCompleted: true,
        completedAt: new Date(),
      });

      progressRepository.findByUserAndLesson.mockResolvedValue(
        existingProgress,
      );

      userTopicProgressRepository.findByUserAndLesson.mockResolvedValue([
        {
          topicId: 'topic-1',
          isCompleted: true,
        },
        {
          topicId: 'topic-2',
          isCompleted: false,
        },
      ]);

      progressRepository.update.mockResolvedValue({
        ...existingProgress,
        completedTopicsCount: 1,
        completionPercentage: 50,
        isLessonCompleted: false,
      });

      const result = await service.updateTopicProgress(
        'user-1',
        'container-1',
        'lesson-1',
        'topic-1',
        { isCompleted: true },
      );

      expect(progressRepository.update).toHaveBeenCalledWith(
        'progress-1',
        {
          totalTopicsCount: 2,
          completedTopicsCount: 1,
          completionPercentage: 50,
          isLessonCompleted: false,
        },
      );

      expect(result.progress.completionPercentage).toBe(50);
      expect(result.topicProgress.isCompleted).toBe(true);
    });

    it('should mark lesson as completed when all topics are completed', async () => {
      const lesson = {
        id: 'lesson-1',
        topics: [
          { id: 'topic-1' },
          { id: 'topic-2' },
        ],
      };

      containerRepository.belongsToUser.mockResolvedValue(true);
      lessonRepository.findByIdAndContainerId.mockResolvedValue(lesson);

      topicRepository.findByIdAndLessonId.mockResolvedValue({
        id: 'topic-2',
        lessonId: 'lesson-1',
      });

      userTopicProgressRepository.findByUserAndTopic.mockResolvedValue(null);

      userTopicProgressRepository.create.mockResolvedValue({
        id: 'topic-progress-2',
        topicId: 'topic-2',
        isCompleted: true,
        completedAt: new Date(),
      });

      progressRepository.findByUserAndLesson.mockResolvedValue({
        id: 'progress-1',
        userId: 'user-1',
        lessonId: 'lesson-1',
        totalTopicsCount: 2,
        completedTopicsCount: 1,
        completionPercentage: 50,
        scrollPosition: 0,
        isLessonCompleted: false,
      });

      userTopicProgressRepository.findByUserAndLesson.mockResolvedValue([
        { topicId: 'topic-1', isCompleted: true },
        { topicId: 'topic-2', isCompleted: true },
      ]);

      progressRepository.update.mockResolvedValue({
        id: 'progress-1',
        userId: 'user-1',
        lessonId: 'lesson-1',
        totalTopicsCount: 2,
        completedTopicsCount: 2,
        completionPercentage: 100,
        scrollPosition: 0,
        isLessonCompleted: true,
      });

      const result = await service.updateTopicProgress(
        'user-1',
        'container-1',
        'lesson-1',
        'topic-2',
        { isCompleted: true },
      );

      expect(result.progress.completionPercentage).toBe(100);
      expect(result.progress.isLessonCompleted).toBe(true);
    });

    it('should reject a topic that does not belong to the lesson', async () => {
      const lesson = {
        id: 'lesson-1',
        topics: [{ id: 'topic-1' }],
      };

      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue(lesson);

      topicRepository.findByIdAndLessonId.mockResolvedValue(null);

      await expect(
        service.updateTopicProgress(
          'user-1',
          'container-1',
          'lesson-1',
          'topic-999',
          { isCompleted: true },
        ),
      ).rejects.toThrow(TopicNotFoundException);

      expect(
        userTopicProgressRepository.create,
      ).not.toHaveBeenCalled();
    });
  });

  describe('completeReview', () => {
    it('should schedule the next review', async () => {
      const lesson = {
        id: 'lesson-1',
      };

      const progress = {
        id: 'progress-1',
        userId: 'user-1',
        lessonId: 'lesson-1',
        reviewCount: 0,
        reviewIntervalDays: 1,
      };

      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue(lesson);

      progressRepository.findByUserAndLesson.mockResolvedValue(progress);

      progressRepository.update.mockResolvedValue({
        ...progress,
        reviewCount: 1,
        reviewIntervalDays: 1,
      });

      const result = await service.completeReview(
        'user-1',
        'container-1',
        'lesson-1',
      );

      expect(progressRepository.update).toHaveBeenCalledWith(
        'progress-1',
        expect.objectContaining({
          reviewCount: 1,
          reviewIntervalDays: 1,
          lastReviewedAt: expect.any(Date),
          nextReviewDate: expect.any(Date),
        }),
      );

      expect(result.message).toBe(
        'Review completed and next review scheduled successfully',
      );
    });
  });
});