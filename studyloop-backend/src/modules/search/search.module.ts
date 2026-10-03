import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from '../../entities/lesson.entity.js';
import { Topic } from '../../entities/topic.entity.js';
import { Progress } from '../../entities/progress.entity.js';
import {
  SearchController,
  GlobalSearchController,
} from './search.controller.js';
import { SearchService } from './search.service.js';
import { SearchRepository } from './repositories/search.repository.js';
import { SEARCH_REPOSITORY } from './repositories/search.repository.interface.js';
import { ContainerModule } from '../container/container.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { LessonModule } from '../lesson/lesson.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Topic, Progress]),
    ContainerModule,
    AuthModule,
    LessonModule
  ],
  controllers: [SearchController, GlobalSearchController],
  providers: [
    SearchService,
    {
      provide: SEARCH_REPOSITORY,
      useClass: SearchRepository,
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}