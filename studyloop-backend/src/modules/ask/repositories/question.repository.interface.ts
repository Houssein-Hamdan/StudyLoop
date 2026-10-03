import type { Question } from '../../../entities/question.entity.js';
import type { QuestionAnswer } from '../../../entities/question-answer.entity.js';

export const QUESTION_REPOSITORY = Symbol('QUESTION_REPOSITORY');
export const QUESTION_ANSWER_REPOSITORY = Symbol('QUESTION_ANSWER_REPOSITORY');

export interface IQuestionRepository {
  findById(id: string): Promise<Question | null>;
  findByIdWithAnswers(id: string): Promise<Question | null>;
  findByLessonId(lessonId: string): Promise<Question[]>;
  findByUserId(userId: string): Promise<Question[]>;
  create(question: Partial<Question>): Promise<Question>;
  delete(id: string): Promise<boolean>;
}

export interface IQuestionAnswerRepository {
  create(answer: Partial<QuestionAnswer>): Promise<QuestionAnswer>;
  findByQuestionId(questionId: string): Promise<QuestionAnswer[]>;
  update(id: string, answer: Partial<QuestionAnswer>): Promise<QuestionAnswer>;
}