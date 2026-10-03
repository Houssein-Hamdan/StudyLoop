import { Module ,forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from '../../entities/progress.entity.js';
import {
  ProgressController,
  UserProgressController,
} from './progress.controller.js';
import { ProgressService } from './progress.service.js';
import { ProgressRepository } from './repositories/progress.repository.js';
import { PROGRESS_REPOSITORY } from './repositories/progress.repository.interface.js';
import { LessonModule } from '../lesson/lesson.module.js';
import { ContainerModule } from '../container/container.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { UserTopicProgress } from '../../entities/user-topic-progress.entity.js';
import { USER_TOPIC_PROGRESS_REPOSITORY } from './repositories/user-topic-progress.repository.interface.js';
import { UserTopicProgressRepository } from './repositories/user-topic-progress.repository.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Progress,UserTopicProgress,]),
    forwardRef(() => LessonModule),
    ContainerModule,
    AuthModule,
  ],
  controllers: [ProgressController, UserProgressController],
  providers: [
    ProgressService,
    {
      provide: PROGRESS_REPOSITORY,
      useClass: ProgressRepository,
    },
    {
      provide: USER_TOPIC_PROGRESS_REPOSITORY,
      useClass: UserTopicProgressRepository,
    },
  ],
  exports: [ProgressService, PROGRESS_REPOSITORY],
})
export class ProgressModule {}
