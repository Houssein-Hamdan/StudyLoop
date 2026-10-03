import { Module , forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from '../../entities/lesson.entity.js';
import { Topic } from '../../entities/topic.entity.js';
import { LessonController } from './lesson.controller.js';
import { LessonService } from './lesson.service.js';
import { LessonRepository } from './repositories/lesson.repository.js';
import { TopicRepository } from './repositories/topic.repository.js';

import { LESSON_REPOSITORY } from './repositories/lesson.repository.interface.js';
import { TOPIC_REPOSITORY } from './repositories/topic.repository.interface.js';
import { ContainerModule } from '../container/container.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { GeminiModule } from '../gemini/gemini.module.js';
import { PublicLessonController } from './public-lesson.controller.js';
import { ProgressModule } from '../progress/progress.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Topic]),
    ContainerModule,
    AuthModule,
    GeminiModule,
    forwardRef(() => ProgressModule),
    ProgressModule
  ],
  controllers: [LessonController,PublicLessonController],
  providers: [
    LessonService,
    {
      provide: LESSON_REPOSITORY,
      useClass: LessonRepository,
    },
    {
      provide: TOPIC_REPOSITORY,
      useClass: TopicRepository,
    },
  ],
  exports: [LessonService, LESSON_REPOSITORY, TOPIC_REPOSITORY],
})
export class LessonModule {}