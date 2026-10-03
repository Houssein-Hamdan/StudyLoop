import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity.js';

export enum SummaryDepth {
  SHORT = 'short',
  MEDIUM = 'medium',
  DETAILED = 'detailed',
}

@Entity('summaries')
export class Summary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lessonId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: SummaryDepth })
  depth: SummaryDepth;

  @Column({ type: 'text', nullable: true })
  selectedTopicIds: string;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}