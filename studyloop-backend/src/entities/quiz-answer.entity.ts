import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import type { User } from './user.entity.js';
import type { QuizQuestion } from './quiz-question.entity.js';

@Entity('quiz_answers')
export class QuizAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  questionId: string;

  @Column()
  userAnswer: string;

  @Column({ default: false })
  isCorrect: boolean;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne('QuizQuestion', (question: QuizQuestion) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: QuizQuestion;

  @CreateDateColumn()
  createdAt: Date;
}