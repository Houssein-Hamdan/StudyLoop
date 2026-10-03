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
import { Quiz } from './quiz.entity.js';
import { QuizAnswer } from './quiz-answer.entity.js';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quizId: string;

  @Column()
  questionText: string;

  @Column({ type: 'text', nullable: true })
  optionsJson: string; 

  @Column({ nullable: true })
  correctAnswer: string;

  @Column()
  format: string; // 'multiple_choice', 'open_text', 'fill_blanks', 'true_false'

  @Column()
  order: number; 

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @OneToMany(() => QuizAnswer, (answer) => answer.question, {
    cascade: true,
  })
  answers: QuizAnswer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}