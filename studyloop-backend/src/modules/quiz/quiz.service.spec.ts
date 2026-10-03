import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QuizService } from './quiz.service.js';

import {
  UnauthorizedLessonAccessException,
  LessonNotFoundException,
  QuizNotFoundException,
  InvalidQuizScopeException,
} from '../../exceptions/auth.exceptions.js';
import { Any } from 'typeorm';

describe('QuizService', () => {
  let service: QuizService;

  const quizRepository = {
    create: vi.fn(),
    findByIdWithQuestions: vi.fn(),
  };

  const quizQuestionRepository = {
    createMany: vi.fn(),
  };

  const quizAnswerRepository = {
    createMany: vi.fn(),
  };

  const lessonRepository = {
    findByIdAndContainerId: vi.fn(),
  };

  const topicRepository = {
    findByIdAndLessonId: vi.fn(),
  };

  const containerRepository = {
    belongsToUser: vi.fn(),
  };

  const quizGeneratorService = {
    generateQuestions: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new QuizService(
      quizRepository as any,
      quizQuestionRepository as any,
      quizAnswerRepository as any,
      lessonRepository as any,
      topicRepository as any,
      containerRepository as any,
      quizGeneratorService as any,
    );
  });

  describe('createQuiz', () => {
    it('should reject access when container does not belong to user', async () => {
      containerRepository.belongsToUser.mockResolvedValue(false);

      await expect(
        service.createQuiz(
          'user-1',
          'container-1',
          'lesson-1',
          {
            scope: 'full_lesson',
            difficulty: 'easy',
            format: 'multiple_choice',
            questionCount: 2,
          } as any,
        ),
      ).rejects.toThrow(UnauthorizedLessonAccessException);

      expect(
        lessonRepository.findByIdAndContainerId,
      ).not.toHaveBeenCalled();
    });

    it('should reject when selected topics do not belong to the lesson', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [
          { id: 'topic-1' },
          { id: 'topic-2' },
        ],
      });

      await expect(
        service.createQuiz(
          'user-1',
          'container-1',
          'lesson-1',
          {
            scope: 'selected_topics',
            selectedTopicIds: ['topic-1', 'topic-999'],
            difficulty: 'easy',
            format: 'multiple_choice',
            questionCount: 2,
          } as any,
        ),
      ).rejects.toThrow(InvalidQuizScopeException);

      expect(
        quizGeneratorService.generateQuestions,
      ).not.toHaveBeenCalled();
    });

    it('should generate questions before creating the quiz', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [
          { id: 'topic-1', title: 'DI' },
          { id: 'topic-2', title: 'DIP' },
        ],
      });

      quizGeneratorService.generateQuestions.mockResolvedValue([
        {
          questionText: 'What is DI?',
          format: 'multiple_choice',
          difficulty: 'easy',
          order: 1,
          correctAnswer: 'Dependency Injection',
          options: ['Dependency Injection', 'Database Index'],
        },
      ]);

      quizRepository.create.mockResolvedValue({
        id: 'quiz-1',
        lessonId: 'lesson-1',
        scope: 'full_lesson',
        difficulty: 'easy',
        format: 'multiple_choice',
        questionCount: 1,
        createdAt: new Date(),
      });

      quizQuestionRepository.createMany.mockResolvedValue([
        {
          id: 'question-1',
          questionText: 'What is DI?',
          format: 'multiple_choice',
          order: 1,
          optionsJson: JSON.stringify([
            'Dependency Injection',
            'Database Index',
          ]),
          correctAnswer: 'Dependency Injection',
        },
      ]);

      const result = await service.createQuiz(
        'user-1',
        'container-1',
        'lesson-1',
        {
          scope: 'full_lesson',
          difficulty: 'easy',
          format: 'multiple_choice',
          questionCount: 1,
        } as any,
      );

      expect(
        quizGeneratorService.generateQuestions,
      ).toHaveBeenCalled();

      expect(quizRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonId: 'lesson-1',
          difficulty: 'easy',
          format: 'multiple_choice',
          questionCount: 1,
        }),
      );

      expect(quizQuestionRepository.createMany).toHaveBeenCalled();

      expect(result.quiz.id).toBe('quiz-1');
    });

    it('should not create a quiz when AI generation returns no questions', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [{ id: 'topic-1' }],
      });

      quizGeneratorService.generateQuestions.mockResolvedValue([]);

      await expect(
        service.createQuiz(
          'user-1',
          'container-1',
          'lesson-1',
          {
            scope: 'full_lesson',
            difficulty: 'easy',
            format: 'multiple_choice',
            questionCount: 2,
          } as any,
        ),
      ).rejects.toThrow(InvalidQuizScopeException);

      expect(quizRepository.create).not.toHaveBeenCalled();
      expect(quizQuestionRepository.createMany).not.toHaveBeenCalled();
    });
  });

  describe('getQuiz', () => {
    it('should not expose correct answers', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [],
      });

      quizRepository.findByIdWithQuestions.mockResolvedValue({
        id: 'quiz-1',
        lessonId: 'lesson-1',
        scope: 'full_lesson',
        difficulty: 'easy',
        format: 'multiple_choice',
        questionCount: 1,
        createdAt: new Date(),
        questions: [
          {
            id: 'question-1',
            questionText: 'What is DI?',
            format: 'multiple_choice',
            order: 1,
            optionsJson: JSON.stringify([
              'Dependency Injection',
              'Database Index',
            ]),
            correctAnswer: 'Dependency Injection',
          },
        ],
      });

      const result = await service.getQuiz(
        'quiz-1',
        'lesson-1',
        'container-1',
        'user-1',
      );

      expect(result.quiz.questions[0]).not.toHaveProperty(
        'correctAnswer',
      );

      expect(result.quiz.questions[0].questionText).toBe(
        'What is DI?',
      );
    });

    it('should reject a quiz that does not belong to the lesson', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [],
      });

      quizRepository.findByIdWithQuestions.mockResolvedValue({
        id: 'quiz-1',
        lessonId: 'another-lesson',
      });

      await expect(
        service.getQuiz(
          'quiz-1',
          'lesson-1',
          'container-1',
          'user-1',
        ),
      ).rejects.toThrow(QuizNotFoundException);
    });
  });

  describe('submitQuiz', () => {
    it('should calculate the score correctly', async () => {
      containerRepository.belongsToUser.mockResolvedValue(true);

      lessonRepository.findByIdAndContainerId.mockResolvedValue({
        id: 'lesson-1',
        topics: [],
      });

      quizRepository.findByIdWithQuestions.mockResolvedValue({
        id: 'quiz-1',
        lessonId: 'lesson-1',
        questions: [
          {
            id: 'q1',
            correctAnswer: 'Paris',
          },
          {
            id: 'q2',
            correctAnswer: 'Beirut',
          },
        ],
      });

      quizAnswerRepository.createMany.mockResolvedValue([]);

      const result = await service.submitQuiz(
        'quiz-1',
        'user-1',
        'container-1',
        'lesson-1',
        {
          answers: [
            {
              questionId: 'q1',
              userAnswer: 'Paris',
            },
            {
              questionId: 'q2',
              userAnswer: 'London',
            },
          ],
        } as any,
      );

      expect(
        quizAnswerRepository.createMany,
      ).toHaveBeenCalledWith([
        {
          userId: 'user-1',
          questionId: 'q1',
          userAnswer: 'Paris',
          isCorrect: true,
        },
        {
          userId: 'user-1',
          questionId: 'q2',
          userAnswer: 'London',
          isCorrect: false,
        },
      ]);

      expect(result.results.correctAnswers).toBe(1);
      expect(result.results.totalQuestions).toBe(2);
      expect(result.results.score).toBe(50);
      expect(result.results.percentage).toBe('50%');
    });
  });
});