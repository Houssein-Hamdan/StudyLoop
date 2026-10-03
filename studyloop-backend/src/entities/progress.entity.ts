import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity.js';
import { Lesson } from './lesson.entity.js';

@Entity('progress')
@Unique(['userId', 'lessonId'])
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  lessonId: string;

  @Column({ default: 0 })
  completedTopicsCount: number;

  @Column({ default: 0 })
  totalTopicsCount: number;

  @Column({ default: 0 })
  completionPercentage: number;

  @Column({ type: 'integer', default: 0 })
  scrollPosition: number;

  @Column({ type: 'boolean', default: false })
  isLessonCompleted: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @Column({ type: 'timestamp', nullable: true })
  lastReviewedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  nextReviewDate: Date | null;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'int', default: 1 })
  reviewIntervalDays: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
