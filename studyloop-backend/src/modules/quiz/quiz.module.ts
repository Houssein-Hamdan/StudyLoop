import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Entities Imports (مع .js)
import { Quiz } from '../../entities/quiz.entity.js';
import { QuizQuestion } from '../../entities/quiz-question.entity.js';
import { QuizAnswer } from '../../entities/quiz-answer.entity.js';

// 2. Controllers & Services Imports (مع .js)
import { QuizController } from './quiz.controller.js';
import { QuizService } from './quiz.service.js';
import { QuizGeneratorService } from './quiz-generator.service.js';

// 3. Concrete Repositories Import
import {
  QuizRepository,
  QuizQuestionRepository,
  QuizAnswerRepository,
} from './repositories/quiz.repository.js';

// 4. Injection Tokens (Symbols) Import
import {
  QUIZ_REPOSITORY,
  QUIZ_QUESTION_REPOSITORY,
  QUIZ_ANSWER_REPOSITORY,
} from './repositories/quiz.repository.interface.js';

// 5. Modules Imports
import { LessonModule } from '../lesson/lesson.module.js';
import { ContainerModule } from '../container/container.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { GeminiModule } from '../gemini/gemini.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizQuestion, QuizAnswer]),
    LessonModule,
    ContainerModule,
    AuthModule,
    GeminiModule,
  ],
  controllers: [QuizController],
  providers: [
    QuizService,
    QuizGeneratorService,
    {
      provide: QUIZ_REPOSITORY,
      useClass: QuizRepository,
    },
    {
      provide: QUIZ_QUESTION_REPOSITORY,
      useClass: QuizQuestionRepository,
    },
    {
      provide: QUIZ_ANSWER_REPOSITORY,
      useClass: QuizAnswerRepository,
    },
  ],
  exports: [QuizService,QUIZ_REPOSITORY],
})
export class QuizModule {}
