import { Inject, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto.js';
import { SubmitQuizDto } from './dto/submit-quiz.dto.js';

import {
  QUIZ_REPOSITORY,
  QUIZ_QUESTION_REPOSITORY,
  QUIZ_ANSWER_REPOSITORY,
} from './repositories/quiz.repository.interface.js';

import type {
  IQuizRepository,
  IQuizQuestionRepository,
  IQuizAnswerRepository,
} from './repositories/quiz.repository.interface.js';

import { LESSON_REPOSITORY } from '../lesson/repositories/lesson.repository.interface.js';
import type { ILessonRepository } from '../lesson/repositories/lesson.repository.interface.js';

import { TOPIC_REPOSITORY } from '../lesson/repositories/topic.repository.interface.js';
import type { ITopicRepository } from '../lesson/repositories/topic.repository.interface.js';

import { CONTAINER_REPOSITORY } from '../container/repositories/container.repository.interface.js';
import type { IContainerRepository } from '../container/repositories/container.repository.interface.js';

import { QuizGeneratorService } from './quiz-generator.service.js';

import {
  LessonNotFoundException,
  UnauthorizedLessonAccessException,
  QuizNotFoundException,
  InvalidQuizScopeException,
  QuizGenerationFailedException,
} from '../../exceptions/auth.exceptions.js';

import type { Quiz } from '../../entities/quiz.entity.js';
import type { QuizQuestion } from '../../entities/quiz-question.entity.js';

@Injectable()
export class QuizService {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,

    @Inject(QUIZ_QUESTION_REPOSITORY)
    private readonly quizQuestionRepository: IQuizQuestionRepository,

    @Inject(QUIZ_ANSWER_REPOSITORY)
    private readonly quizAnswerRepository: IQuizAnswerRepository,

    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,

    @Inject(TOPIC_REPOSITORY)
    private readonly topicRepository: ITopicRepository,

    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepository: IContainerRepository,

    private readonly quizGeneratorService: QuizGeneratorService,
  ) {}

  /**
   * Create and generate a quiz
   */
  async createQuiz(
    userId: string,
    containerId: string,
    lessonId: string,
    createQuizDto: CreateQuizDto,
  ) {
    // Verify container ownership
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );
    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }

    // Verify lesson exists in container
    const lesson = await this.lessonRepository.findByIdAndContainerId(
      lessonId,
      containerId,
    );
    if (!lesson) {
      throw new LessonNotFoundException();
    }

    // Get topics based on scope
    let topicsToUse = lesson.topics;

    if (createQuizDto.scope === 'selected_topics') {
      const selectedIds = createQuizDto.selectedTopicIds;
      if (!selectedIds || selectedIds.length === 0) {
        throw new InvalidQuizScopeException();
      }

      const selectedTopics = lesson.topics.filter((topic) =>
        selectedIds.includes(topic.id),
      );

      if (selectedTopics.length !== selectedIds.length) {
        throw new InvalidQuizScopeException();
      }

      topicsToUse = selectedTopics;
    } else if (createQuizDto.scope === 'random') {
      topicsToUse = this.shuffleArray(lesson.topics);
    }

    if (topicsToUse.length === 0) {
      throw new InvalidQuizScopeException();
    }

    // Generate questions first
    const generatedQuestions =
      await this.quizGeneratorService.generateQuestions(
        topicsToUse,
        createQuizDto.difficulty,
        createQuizDto.format,
        createQuizDto.questionCount,
      );

    if (!generatedQuestions || generatedQuestions.length === 0) {
      throw new QuizGenerationFailedException();
    }

    // Create quiz record only after AI generation succeeds
    const quiz = await this.quizRepository.create({
      lessonId,
      scope: createQuizDto.scope as any,
      selectedTopicIds: createQuizDto.selectedTopicIds
        ? JSON.stringify(createQuizDto.selectedTopicIds)
        : undefined,
      difficulty: createQuizDto.difficulty,
      format: createQuizDto.format,
      questionCount: createQuizDto.questionCount,
    });

    // Create questions in database
    const questionsData: Partial<QuizQuestion>[] = generatedQuestions.map(
      (q) => ({
        quizId: quiz.id,
        questionText: q.questionText,
        format: q.format,
        order: q.order,
        optionsJson: q.options ? JSON.stringify(q.options) : undefined,
        correctAnswer: q.correctAnswer,
      }),
    );

    const createdQuestions =
      await this.quizQuestionRepository.createMany(questionsData);

    return {
      message: 'Quiz generated successfully',
      quiz: this.formatQuizForUser(quiz, createdQuestions),
    };
  }

  private async verifyLessonOwnership(
    lessonId: string,
    containerId: string,
    userId: string,
  ) {
    const isOwner = await this.quizRepository.verifyLessonOwnership(
      lessonId,
      containerId,
      userId,
    );

    if (!isOwner) {
      throw new UnauthorizedLessonAccessException();
    }
  }

  async getLessonQuizzes(
    lessonId: string,
    containerId: string,
    userId: string,
  ) {
    await this.verifyLessonOwnership(lessonId, containerId, userId);

    const quizzes = await this.quizRepository.findByLessonId(lessonId);

    return {
      message: 'Lesson quizzes retrieved successfully',
      count: quizzes.length,
      quizzes: quizzes.map((quiz) => this.formatQuizForUser(quiz)),
    };
  }

  /**
   * Get a quiz with questions (without showing correct answers)
   */
  async getQuiz(
    quizId: string,
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

    const quiz = await this.quizRepository.findByIdWithQuestions(quizId);
    if (!quiz || quiz.lessonId !== lessonId) {
      throw new QuizNotFoundException();
    }

    return {
      message: 'Quiz retrieved successfully',
      quiz: this.formatQuizForUser(quiz),
    };
  }

  /**
   * Submit quiz answers and get results
   */
  async submitQuiz(
    quizId: string,
    userId: string,
    containerId: string,
    lessonId: string,
    submitQuizDto: SubmitQuizDto,
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

    const quiz = await this.quizRepository.findByIdWithQuestions(quizId);
    if (!quiz || quiz.lessonId !== lessonId) {
      throw new QuizNotFoundException();
    }

    const answers = submitQuizDto.answers.map((answer) => {
      const question = quiz.questions?.find((q) => q.id === answer.questionId);
      if (!question) {
        throw new QuizNotFoundException();
      }

      const isCorrect = this.checkAnswer(
        answer.userAnswer,
        question.correctAnswer,
      );

      return {
        userId,
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect,
      };
    });

    await this.quizAnswerRepository.createMany(answers);

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const score = (correctCount / answers.length) * 100;

    return {
      message: 'Quiz submitted successfully',
      results: {
        quizId: quiz.id,
        totalQuestions: answers.length,
        correctAnswers: correctCount,
        score: Math.round(score),
        percentage: `${Math.round(score)}%`,
      },
    };
  }

  private checkAnswer(userAnswer: string, correctAnswer: string): boolean {
    return (
      userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    );
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private formatQuiz(quiz: Quiz, questions: QuizQuestion[]) {
    return {
      id: quiz.id,
      lessonId: quiz.lessonId,
      scope: quiz.scope,
      difficulty: quiz.difficulty,
      format: quiz.format,
      questionCount: quiz.questionCount,
      questions: questions.map((q: QuizQuestion) => ({
        id: q.id,
        questionText: q.questionText,
        format: q.format,
        order: q.order,
        options: q.optionsJson ? JSON.parse(q.optionsJson) : null,
        correctAnswer: q.correctAnswer,
      })),
      createdAt: quiz.createdAt,
    };
  }

  private formatQuizForUser(quiz: Quiz, questions?: QuizQuestion[]) {
    return {
      id: quiz.id,
      lessonId: quiz.lessonId,
      scope: quiz.scope,
      difficulty: quiz.difficulty,
      format: quiz.format,
      questionCount: quiz.questionCount,

      questions: (questions ?? quiz.questions ?? []).map((q: QuizQuestion) => ({
        id: q.id,
        questionText: q.questionText,
        format: q.format,
        order: q.order,
        options: q.optionsJson ? JSON.parse(q.optionsJson) : null,
      })),

      createdAt: quiz.createdAt,
    };
  }
}
