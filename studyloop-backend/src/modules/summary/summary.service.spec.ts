import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SummaryService } from './summary.service.js';

import {
  UnauthorizedLessonAccessException,
  LessonNotFoundException,
  SummaryNotFoundException,
} from '../../exceptions/auth.exceptions.js';

describe('SummaryService', () => {
  let service: SummaryService;

  const summaryRepository = {
    findByLessonIdAndDepth: vi.fn(),
    create: vi.fn(),
    findByLessonId: vi.fn(),
    findById: vi.fn(),
    delete: vi.fn(),
  };

  const lessonRepository = {
    findByIdAndContainerId: vi.fn(),
  };

  const containerRepository = {
    belongsToUser: vi.fn(),
  };

  const summarizationService = {
    generateSummary: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new SummaryService(
      summaryRepository as any,
      lessonRepository as any,
      containerRepository as any,
      summarizationService as any,
    );
  });

  describe('createSummary', () => {
    it('should reject access when container does not belong to user', async () => {
      containerRepository.belongsToUser.mockResolvedValue(false);

      await expect(
        service.createSummary(
          'user-1',
          'container-1',
          'lesson-1',
          {
            depth: 'short',
          } as any,
        ),
      ).rejects.toThrow(UnauthorizedLessonAccessException);

      expect(
        lessonRepository.findByIdAndContainerId,
      ).not.toHaveBeenCalled();
    });

    it('should reject selected topics that do not belong to the lesson', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [
          { id: 'topic-1' },
          { id: 'topic-2' },
        ],
      });

      await expect(
        service.createSummary(
          'user-1',
          'container-1',
          'lesson-1',
          {
            depth: 'short',
            selectedTopicIds: ['topic-1', 'topic-999'],
          } as any,
        ),
      ).rejects.toThrow(UnauthorizedLessonAccessException);

      expect(
        summaryRepository.findByLessonIdAndDepth,
      ).not.toHaveBeenCalled();

      expect(
        summarizationService.generateSummary,
      ).not.toHaveBeenCalled();
    });

    it('should return an existing summary instead of generating a new one', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [{ id: 'topic-1' }],
      });

      const existingSummary = {
        id: 'summary-1',
        lessonId: 'lesson-1',
        depth: 'short',
        content: 'Existing summary',
        selectedTopicIds: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      summaryRepository.findByLessonIdAndDepth.mockResolvedValue(
        existingSummary,
      );

      const result = await service.createSummary(
        'user-1',
        'container-1',
        'lesson-1',
        {
          depth: 'short',
        } as any,
      );

      expect(result.message).toBe(
        'Summary retrieved successfully',
      );

      expect(result.summary.content).toBe('Existing summary');

      expect(
        summarizationService.generateSummary,
      ).not.toHaveBeenCalled();

      expect(summaryRepository.create).not.toHaveBeenCalled();
    });

    it('should generate and save a new summary', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [
          { id: 'topic-1', title: 'Dependency Injection' },
          { id: 'topic-2', title: 'DIP' },
        ],
      });

      summaryRepository.findByLessonIdAndDepth.mockResolvedValue(null);

      summarizationService.generateSummary.mockResolvedValue(
        'Generated summary',
      );

      summaryRepository.create.mockResolvedValue({
        id: 'summary-1',
        lessonId: 'lesson-1',
        depth: 'short',
        content: 'Generated summary',
        selectedTopicIds: JSON.stringify(['topic-1']),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createSummary(
        'user-1',
        'container-1',
        'lesson-1',
        {
          depth: 'short',
          selectedTopicIds: ['topic-1'],
        } as any,
      );

      expect(
        summarizationService.generateSummary,
      ).toHaveBeenCalledWith(
        [{ id: 'topic-1', title: 'Dependency Injection' }],
        'short',
      );

      expect(summaryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonId: 'lesson-1',
          content: 'Generated summary',
          depth: 'short',
          selectedTopicIds: JSON.stringify(['topic-1']),
        }),
      );

      expect(result.message).toBe(
        'Summary generated and saved successfully',
      );

      expect(result.summary.selectedTopicIds).toEqual([
        'topic-1',
      ]);
    });
  });

  describe('getSummary', () => {
    it('should reject a summary that does not belong to the lesson', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [],
      });

      summaryRepository.findById.mockResolvedValue({
        id: 'summary-1',
        lessonId: 'another-lesson',
        depth: 'short',
        content: 'Summary',
      });

      await expect(
        service.getSummary(
          'summary-1',
          'lesson-1',
          'container-1',
          'user-1',
        ),
      ).rejects.toThrow(SummaryNotFoundException);
    });
  });

  describe('deleteSummary', () => {
    it('should delete an existing summary', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [],
      });

      summaryRepository.findById.mockResolvedValue({
        id: 'summary-1',
        lessonId: 'lesson-1',
      });

      summaryRepository.delete.mockResolvedValue(true);

      const result = await service.deleteSummary(
        'summary-1',
        'lesson-1',
        'container-1',
        'user-1',
      );

      expect(summaryRepository.delete).toHaveBeenCalledWith(
        'summary-1',
      );

      expect(result.message).toBe(
        'Summary deleted successfully',
      );
    });
  });
});