import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';
import { LessonModule } from '../lesson/lesson.module.js';
import { AnnotationModule } from '../annotation/annotation.module.js';
import { QuizModule } from '../quiz/quiz.module.js';
import { ProgressModule } from '../progress/progress.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [LessonModule, AnnotationModule, QuizModule,ProgressModule,AuthModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}