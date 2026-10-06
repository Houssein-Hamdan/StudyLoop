import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Summary } from '../../entities/summary.entity.js';
import { SummaryController } from './summary.controller.js';
import { SummaryService } from './summary.service.js';
import { SummarizationService } from './summarization.service.js';
import { SummaryRepository } from './repositories/summary.repository.js';
import { SUMMARY_REPOSITORY } from './repositories/summary.repository.interface.js';
import { LessonModule } from '../lesson/lesson.module.js';
import { ContainerModule } from '../container/container.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { GroqModule } from '../groq/groq.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Summary]),
    LessonModule,
    ContainerModule,
    AuthModule,
    GroqModule,
  ],
  controllers: [SummaryController],
  providers: [
    SummaryService,
    SummarizationService,
    {
      provide: SUMMARY_REPOSITORY,
      useClass: SummaryRepository,
    },
  ],
  exports: [SummaryService, SUMMARY_REPOSITORY],
})
export class SummaryModule {}
