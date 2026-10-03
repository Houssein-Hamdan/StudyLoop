import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../../../entities/quiz.entity.js';
import { QuizQuestion } from '../../../entities/quiz-question.entity.js';
import { QuizAnswer } from '../../../entities/quiz-answer.entity.js';
import type {
  IQuizRepository,
  IQuizQuestionRepository,
  IQuizAnswerRepository,
} from './quiz.repository.interface.js';

@Injectable()
export class QuizRepository implements IQuizRepository {
  constructor(
    @InjectRepository(Quiz)
    private readonly repository: Repository<Quiz>,
  ) {}

  async findById(id: string): Promise<Quiz | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdWithQuestions(id: string): Promise<Quiz | null> {
    return this.repository.findOne({
      where: { id },
      relations: { questions: true },
    });
  }

  async findByLessonId(lessonId: string): Promise<Quiz[]> {
    return this.repository.find({
      where: { lessonId },
      relations: { questions: true },
    });
  }

  async create(quiz: Partial<Quiz>): Promise<Quiz> {
    const newQuiz = this.repository.create(quiz);
    return this.repository.save(newQuiz);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getUserQuizStats(userId: string) {
    const totalTakenResult = await this.repository
      .createQueryBuilder('quiz')
      .innerJoin('quiz.questions', 'question')
      .innerJoin('question.answers', 'answer')
      .where('answer.userId = :userId', { userId })
      .select('COUNT(DISTINCT quiz.id)', 'totalTaken')
      .getRawOne();

    const scoreResult = await this.repository.manager
      .createQueryBuilder()
      .select(
        'ROUND(AVG(CASE WHEN answer."isCorrect" = true THEN 100 ELSE 0 END))',
        'averageScore',
      )
      .from('quiz_answers', 'answer')
      .where('answer."userId" = :userId', { userId })
      .getRawOne();

    return {
      totalTaken: parseInt(totalTakenResult?.totalTaken || '0', 10),
      averageScore: parseFloat(scoreResult?.averageScore || '0'),
    };
  }
  
  async verifyLessonOwnership(
    lessonId: string,
    containerId: string,
    userId: string,
  ): Promise<boolean> {
    const count = await this.repository.manager
      .createQueryBuilder()
      .select('lesson.id')
      .from('lessons', 'lesson')
      .innerJoin('lesson.container', 'container')
      .where('lesson.id = :lessonId', { lessonId })
      .andWhere('container.id = :containerId', { containerId })
      .andWhere('container.userId = :userId', { userId })
      .getCount();

    return count > 0;
  }
}

@Injectable()
export class QuizQuestionRepository implements IQuizQuestionRepository {
  constructor(
    @InjectRepository(QuizQuestion)
    private readonly repository: Repository<QuizQuestion>,
  ) {}

  async createMany(
    questions: Partial<QuizQuestion>[],
  ): Promise<QuizQuestion[]> {
    const newQuestions = this.repository.create(questions);
    return this.repository.save(newQuestions);
  }

  async findByQuizId(quizId: string): Promise<QuizQuestion[]> {
    return this.repository.find({
      where: { quizId },
      order: { order: 'ASC' },
    });
  }
}

@Injectable()
export class QuizAnswerRepository implements IQuizAnswerRepository {
  constructor(
    @InjectRepository(QuizAnswer)
    private readonly repository: Repository<QuizAnswer>,
  ) {}

  async create(answer: Partial<QuizAnswer>): Promise<QuizAnswer> {
    const newAnswer = this.repository.create(answer);
    return this.repository.save(newAnswer);
  }

  async createMany(answers: Partial<QuizAnswer>[]): Promise<QuizAnswer[]> {
    const newAnswers = this.repository.create(answers);
    return this.repository.save(newAnswers);
  }

  async findByQuizAndUser(
    quizId: string,
    userId: string,
  ): Promise<QuizAnswer[]> {
    return this.repository.find({
      where: {
        userId,
        question: { quizId },
      },
      relations: { question: true },
    });
  }
}
