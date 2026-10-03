import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import type { Lesson } from './lesson.entity.js';
import type { QuizQuestion } from './quiz-question.entity.js';

export enum QuizScope {
  FULL_LESSON = 'full_lesson',
  SELECTED_TOPICS = 'selected_topics',
  RANDOM = 'random',
}

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lessonId: string;

  @Column({ type: 'enum', enum: QuizScope })
  scope: QuizScope;

  @Column({ type: 'text', nullable: true })
  selectedTopicIds: string;

  @Column()
  difficulty: string;

  @Column()
  format: string;

  @Column()
  questionCount: number;

  @ManyToOne('Lesson', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @OneToMany('QuizQuestion', (question: QuizQuestion) => question.quiz, {
    cascade: true,
  })
  questions: QuizQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}