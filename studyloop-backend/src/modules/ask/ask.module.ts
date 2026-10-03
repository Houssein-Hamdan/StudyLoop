import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity.js';
import { QuestionAnswer } from '../../entities/question-answer.entity.js';
import { AskController, UserQuestionsController } from './ask.controller.js';
import { AskService } from './ask.service.js';
import { AIService } from './ai.service.js';
import {
  QuestionRepository,
  QuestionAnswerRepository,
} from './repositories/question.repository.js';
import {
  QUESTION_REPOSITORY,
  QUESTION_ANSWER_REPOSITORY,
} from './repositories/question.repository.interface.js';
import { LessonModule } from '../lesson/lesson.module.js';
import { ContainerModule } from '../container/container.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { GeminiModule } from '../gemini/gemini.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionAnswer]),
    LessonModule,
    ContainerModule,
    AuthModule,
    GeminiModule,
  ],
  controllers: [AskController, UserQuestionsController],
  providers: [
    AskService,
    AIService,
    {
      provide: QUESTION_REPOSITORY,
      useClass: QuestionRepository,
    },
    {
      provide: QUESTION_ANSWER_REPOSITORY,
      useClass: QuestionAnswerRepository,
    },
  ],
  exports: [AskService],
})
export class AskModule {}
