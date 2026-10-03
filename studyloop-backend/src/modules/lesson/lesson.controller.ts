import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import type { Request } from 'express';
import { LessonService } from './lesson.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { UpdateLessonShareDto } from './dto/update-lesson-share.dto.js';
import { ParseRawTextDto } from './dto/parse-raw-text.dto.js';
import { CreateTopicDto } from './dto/create-lesson.dto.js';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
  };
}

@Controller('containers/:containerId/lessons')
@UseGuards(JwtGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  /**
   * Create a new lesson with topics
   * POST /containers/:containerId/lessons
   */
  @Post()
  async createLesson(
    @Param('containerId') containerId: string,
    @Body() createLessonDto: CreateLessonDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.lessonService.createLesson(
      containerId,
      req.user.sub,
      createLessonDto,
    );
  }

  @Post(':lessonId/topics')
  async createTopic(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Body() createTopicDto: CreateTopicDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.lessonService.createTopic(
      lessonId,
      containerId,
      req.user.sub,
      createTopicDto,
    );
  }

  /**
   * Get all lessons in a container
   * GET /containers/:containerId/lessons
   */
  @Get()
  async getLessonsByContainer(
    @Param('containerId') containerId: string,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.lessonService.getLessonsByContainer(containerId, req.user.sub);
  }

  /**
   * Get a specific lesson
   * GET /containers/:containerId/lessons/:id
   */
  @Get(':id')
  async getLesson(
    @Param('containerId') containerId: string,
    @Param('id') lessonId: string,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.lessonService.getLesson(lessonId, containerId, req.user.sub);
  }

  /**
   * PUT /containers/:containerId/lessons/:id
   */
  @Put(':id')
  async updateLesson(
    @Param('containerId') containerId: string,
    @Param('id') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.lessonService.updateLesson(
      lessonId,
      containerId,
      req.user.sub,
      updateLessonDto,
    );
  }

  /**
   * Delete a lesson
   * DELETE /containers/:containerId/lessons/:id
   */
  @Delete(':id')
  async deleteLesson(
    @Param('containerId') containerId: string,
    @Param('id') lessonId: string,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.lessonService.deleteLesson(lessonId, containerId, req.user.sub);
  }

  /**
   * Update a topic (title, description, completion status)
   * PUT /containers/:containerId/lessons/:lessonId/topics/:topicId
   */
  @Put(':lessonId/topics/:topicId')
  async updateTopic(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Param('topicId') topicId: string,
    @Body() updateTopicDto: UpdateTopicDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.lessonService.updateTopic(
      topicId,
      lessonId,
      containerId,
      req.user.sub,
      updateTopicDto,
    );
  }

  /**
   * Delete a topic
   * DELETE /containers/:containerId/lessons/:lessonId/topics/:topicId
   */
  @Delete(':lessonId/topics/:topicId')
  async deleteTopic(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Param('topicId') topicId: string,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.lessonService.deleteTopic(
      topicId,
      lessonId,
      containerId,
      req.user.sub,
    );
  }
  @Post('parse-raw')
  async parseRawText(@Body() dto: ParseRawTextDto) {
    return this.lessonService.parseRawText(dto.rawContent);
  }
  // 1. Toggle Share Status
  @Patch(':lessonId/share')
  async toggleShareStatus(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateLessonShareDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.lessonService.toggleShareStatus(
      lessonId,
      containerId,
      req.user.sub,
      dto.isPublic,
    );
  }
}
