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
import type { Annotation } from './annotation.entity.js';
import type { UserTopicProgress } from './user-topic-progress.entity.js';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column('uuid')
  lessonId: string;

  @ManyToOne('Lesson', (lesson: Lesson) => lesson.topics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson; 

  @OneToMany('Annotation', (annotation: Annotation) => annotation.topic)
  annotations: Annotation[];

  @OneToMany(
    'UserTopicProgress',
    (progress: UserTopicProgress) => progress.topic,
  )
  userProgress: UserTopicProgress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
