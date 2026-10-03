import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../../entities/question.entity.js';
import { QuestionAnswer } from '../../../entities/question-answer.entity.js';
import type {
  IQuestionRepository,
  IQuestionAnswerRepository,
} from './question.repository.interface.js';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly repository: Repository<Question>,
  ) {}

  async findById(id: string): Promise<Question | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdWithAnswers(id: string): Promise<Question | null> {
    return this.repository.findOne({
      where: { id },
      relations: { answers: true }, 
    });
  }

  async findByLessonId(lessonId: string): Promise<Question[]> {
    return this.repository.find({
      where: { lessonId },
      relations: { answers: true }, 
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Question[]> {
    return this.repository.find({
      where: { userId },
      relations: { answers: true }, 
      order: { createdAt: 'DESC' },
    });
  }

  async create(question: Partial<Question>): Promise<Question> {
    const newQuestion = this.repository.create(question);
    return this.repository.save(newQuestion);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

@Injectable()
export class QuestionAnswerRepository implements IQuestionAnswerRepository {
  constructor(
    @InjectRepository(QuestionAnswer)
    private readonly repository: Repository<QuestionAnswer>,
  ) {}

  async create(answer: Partial<QuestionAnswer>): Promise<QuestionAnswer> {
    const newAnswer = this.repository.create(answer);
    return this.repository.save(newAnswer);
  }

  async findByQuestionId(questionId: string): Promise<QuestionAnswer[]> {
    return this.repository.find({
      where: { questionId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, answer: Partial<QuestionAnswer>): Promise<QuestionAnswer> {
    await this.repository.update(id, answer);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`QuestionAnswer with id ${id} not found`);
    }
    return updated;
  }
}