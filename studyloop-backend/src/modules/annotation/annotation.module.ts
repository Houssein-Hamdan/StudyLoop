import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Annotation } from '../../entities/annotation.entity.js';
import { AnnotationController } from './annotation.controller.js';
import { AnnotationService } from './annotation.service.js';
import { AnnotationRepository } from './repositories/annotation.repository.js';
import { ANNOTATION_REPOSITORY } from './repositories/annotation.repository.interface.js';
import { LessonModule } from '../lesson/lesson.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Annotation]),
    LessonModule,
    AuthModule,
],
  controllers: [AnnotationController],
  providers: [
    AnnotationService,
    {
      provide: ANNOTATION_REPOSITORY,
      useClass: AnnotationRepository,
    },
  ],
  exports: [AnnotationService,ANNOTATION_REPOSITORY],
})
export class AnnotationModule {}