import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ContainerModule } from './modules/container/container.module.js';
import { LessonModule } from './modules/lesson/lesson.module.js';
import { QuizModule } from './modules/quiz/quiz.module.js';
import { SummaryModule } from './modules/summary/summary.module.js';
import { ProgressModule } from './modules/progress/progress.module.js';
import { AskModule } from './modules/ask/ask.module.js';
import { SearchModule } from './modules/search/search.module.js';
import { GeminiModule } from './modules/gemini/gemini.module.js';
import { AnnotationModule } from './modules/annotation/annotation.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    ContainerModule,
    LessonModule,
    QuizModule,
    SummaryModule,
    ProgressModule,
    AskModule,
    SearchModule,
    GeminiModule,
    AnnotationModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
