import { Injectable, Inject } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto.js';
import {
  QUESTION_REPOSITORY,
  QUESTION_ANSWER_REPOSITORY,
  type IQuestionRepository,
  type IQuestionAnswerRepository,
} from './repositories/question.repository.interface.js';
import {
  LESSON_REPOSITORY,
  type ILessonRepository,
} from '../lesson/repositories/lesson.repository.interface.js';
import {
  CONTAINER_REPOSITORY,
  type IContainerRepository,
} from '../container/repositories/container.repository.interface.js';
import { AIService } from './ai.service.js';
import {
  LessonNotFoundException,
  UnauthorizedLessonAccessException,
  QuestionNotFoundException,
  TopicNotFoundException,
} from '../../exceptions/auth.exceptions.js';

@Injectable()
export class AskService {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
    @Inject(QUESTION_ANSWER_REPOSITORY)
    private readonly questionAnswerRepository: IQuestionAnswerRepository,
    @Inject(LESSON_REPOSITORY)
    private readonly lessonRepository: ILessonRepository,
    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepository: IContainerRepository,
    private readonly aiService: AIService,
  ) {}

  /**
   * Ask a question about a lesson
   */
  async askQuestion(
    userId: string,
    containerId: string,
    lessonId: string,
    createQuestionDto: CreateQuestionDto,
  ) {
    // Verify container ownership
    const containerOwned = await this.containerRepository.belongsToUser(
      containerId,
      userId,
    );

    if (!containerOwned) {
      throw new UnauthorizedLessonAccessException();
    }

    // Verify lesson exists and belongs to the container
    const lesson = await this.lessonRepository.findByIdAndContainerId(
      lessonId,
      containerId,
    );

    if (!lesson) {
      throw new LessonNotFoundException();
    }

    // If topicId is provided, verify it belongs to this lesson
    if (createQuestionDto.topicId) {
      const topic = lesson.topics?.find(
        (t) => t.id === createQuestionDto.topicId,
      );

      if (!topic) {
        throw new TopicNotFoundException();
      }
    }

    // Prepare context for AI
    const lessonContext = lesson.title;

    const topicContext = createQuestionDto.topicId
      ? lesson.topics?.find((t) => t.id === createQuestionDto.topicId)?.title
      : undefined;

    // Generate AI response before creating database records
    const aiResponse = await this.aiService.generateResponse(
      createQuestionDto.questionText,
      lessonContext,
      topicContext,
    );

    // Create question record
    const question = await this.questionRepository.create({
      userId,
      lessonId,
      questionText: createQuestionDto.questionText,
      topicId: createQuestionDto.topicId,
    });

    // Save AI answer
    const answer = await this.questionAnswerRepository.create({
      questionId: question.id,
      answerText: aiResponse,
      status: 'answered',
      aiProvider: 'placeholder',
    });

    return {
      message: 'Question answered successfully',
      question: this.formatQuestionWithAnswer(question, answer),
    };
  }
  /**
   * Get all questions for a lesson
   */
  async getLessonQuestions(
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

    const questions = await this.questionRepository.findByLessonId(lessonId);

    return {
      message: 'Lesson questions retrieved successfully',
      count: questions.length,
      questions: questions.map((q) => this.formatQuestion(q)),
    };
  }

  /**
   * Get a specific question with its answer
   */
  async getQuestion(
    questionId: string,
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

    const question =
      await this.questionRepository.findByIdWithAnswers(questionId);
    if (!question || question.lessonId !== lessonId) {
      throw new QuestionNotFoundException();
    }

    return {
      message: 'Question retrieved successfully',
      question: this.formatQuestion(question),
    };
  }

  /**
   * Get all user's questions across all lessons
   */
  async getUserQuestions(userId: string) {
    const questions = await this.questionRepository.findByUserId(userId);

    return {
      message: 'User questions retrieved successfully',
      count: questions.length,
      questions: questions.map((q) => this.formatQuestion(q)),
    };
  }

  /**
   * Delete a question
   */
  async deleteQuestion(
    questionId: string,
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

    const question = await this.questionRepository.findById(questionId);
    if (
      !question ||
      question.lessonId !== lessonId ||
      question.userId !== userId
    ) {
      throw new QuestionNotFoundException();
    }

    const deleted = await this.questionRepository.delete(questionId);
    if (!deleted) {
      throw new QuestionNotFoundException();
    }

    return {
      message: 'Question deleted successfully',
    };
  }

  private formatQuestion(question: any) {
    return {
      id: question.id,
      lessonId: question.lessonId,
      userId: question.userId,
      questionText: question.questionText,
      topicId: question.topicId,
      answers: question.answers
        ? question.answers.map((a: any) => ({
            id: a.id,
            answerText: a.answerText,
            status: a.status,
            aiProvider: a.aiProvider,
            createdAt: a.createdAt,
          }))
        : [],
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatQuestionWithAnswer(question: any, answer: any) {
    return {
      id: question.id,
      lessonId: question.lessonId,
      userId: question.userId,
      questionText: question.questionText,
      topicId: question.topicId,
      answer: {
        id: answer.id,
        answerText: answer.answerText,
        status: answer.status,
        aiProvider: answer.aiProvider,
        createdAt: answer.createdAt,
      },
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
