import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  type Relation, 
} from 'typeorm';
import type { Question } from './question.entity.js'; 

@Entity('question_answers')
export class QuestionAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  questionId: string;

  @Column({ type: 'text' })
  answerText: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'answered' | 'failed';

  @Column({ nullable: true })
  aiProvider: string;

  @ManyToOne('Question', (question: any) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Relation<Question>; 

  @CreateDateColumn()
  createdAt: Date;
}