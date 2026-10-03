import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { SearchService } from './search.service.js';
import { SearchLessonDto } from './dto/search-lesson.dto.js';
import { SearchTopicDto } from './dto/search-topic.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    sub: string;
    [key: string]: any;
  };
}

@Controller('containers/:containerId/search')
@UseGuards(JwtGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Search lessons in a specific container
   * GET /containers/:containerId/search/lessons
   */
  @Get('lessons')
  async searchLessonsInContainer(
    @Param('containerId') containerId: string,
    @Query() filters: SearchLessonDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.searchService.searchLessonsInContainer(
      req.user.sub,
      containerId,
      filters,
    );
  }

  /**
   * Search topics in a specific lesson
   * GET /containers/:containerId/search/lessons/:lessonId/topics
   */
  @Get('lessons/:lessonId/topics')
  async searchTopicsInLesson(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Query() filters: SearchTopicDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.searchService.searchTopicsInLesson(
      req.user.sub,
      containerId,
      lessonId,
      filters,
    );
  }

  /**
   * Search topics across all lessons in a container
   * GET /containers/:containerId/search/topics
   */
  @Get('topics')
  async searchTopicsAcrossLessons(
    @Param('containerId') containerId: string,
    @Query() filters: SearchTopicDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.searchService.searchTopicsAcrossLessons(
      req.user.sub,
      containerId,
      filters,
    );
  }
}

@Controller('search')
@UseGuards(JwtGuard)
export class GlobalSearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Global search across all user lessons
   * GET /search/lessons
   */
  @Get('lessons')
  async searchLessonsGlobal(
    @Query() filters: SearchLessonDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.searchService.searchLessonsAcrossContainers(
      req.user.sub,
      filters,
    );
  }
}