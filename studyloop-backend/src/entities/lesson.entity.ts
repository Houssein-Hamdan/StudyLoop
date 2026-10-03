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

import type { Container } from './container.entity.js';
import type { Topic } from './topic.entity.js';
import type { Annotation } from './annotation.entity.js';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  containerId: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'varchar', nullable: true, unique: true })
  shareToken: string | null;

  @ManyToOne('Container', (container: Container) => container.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'containerId' })
  container: Container;

  @OneToMany('Topic', (topic: Topic) => topic.lesson, { cascade: true })
  topics: Topic[];

  @OneToMany('Annotation', (annotation: Annotation) => annotation.lesson)
  annotations: Annotation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}