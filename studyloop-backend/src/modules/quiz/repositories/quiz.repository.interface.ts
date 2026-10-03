import { Quiz } from '../../../entities/quiz.entity.js';
import { QuizQuestion } from '../../../entities/quiz-question.entity.js';
import { QuizAnswer } from '../../../entities/quiz-answer.entity.js';

export const QUIZ_REPOSITORY = Symbol('QUIZ_REPOSITORY');
export const QUIZ_QUESTION_REPOSITORY = Symbol('QUIZ_QUESTION_REPOSITORY');
export const QUIZ_ANSWER_REPOSITORY = Symbol('QUIZ_ANSWER_REPOSITORY');

export interface IQuizRepository {
  findById(id: string): Promise<Quiz | null>;
  findByIdWithQuestions(id: string): Promise<Quiz | null>;
  findByLessonId(lessonId: string): Promise<Quiz[]>;
  create(quiz: Partial<Quiz>): Promise<Quiz>;
  delete(id: string): Promise<boolean>;
  getUserQuizStats(
    userId: string,
  ): Promise<{ totalTaken: number; averageScore: number }>;
  verifyLessonOwnership(
    lessonId: string,
    containerId: string,
    userId: string,
  ): Promise<boolean>;
}

export interface IQuizQuestionRepository {
  createMany(questions: Partial<QuizQuestion>[]): Promise<QuizQuestion[]>;
  findByQuizId(quizId: string): Promise<QuizQuestion[]>;
}

export interface IQuizAnswerRepository {
  create(answer: Partial<QuizAnswer>): Promise<QuizAnswer>;
  createMany(answers: Partial<QuizAnswer>[]): Promise<QuizAnswer[]>;
  findByQuizAndUser(quizId: string, userId: string): Promise<QuizAnswer[]>;
}
