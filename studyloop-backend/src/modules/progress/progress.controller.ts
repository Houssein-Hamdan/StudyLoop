import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { ProgressService } from './progress.service.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { UpdateTopicProgressDto } from './dto/update-topic-progress.dto.js';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    sub: string;
  };
}

@Controller('containers/:containerId/lessons/:lessonId/progress')
@UseGuards(JwtGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /**
   * Get or create progress for a lesson
   * GET /containers/:containerId/lessons/:lessonId/progress
   */
  @Get()
  async getOrCreateProgress(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.progressService.getOrCreateProgress(
      req.user.sub,
      containerId,
      lessonId,
    );
  }

  /**
   * Update progress ( position, completion status)
   * PUT /containers/:containerId/lessons/:lessonId/progress
   */
  @Put()
  async updateProgress(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Body() updateProgressDto: UpdateProgressDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.progressService.updateProgress(
      req.user.sub,
      containerId,
      lessonId,
      updateProgressDto,
    );
  }
  @Patch('topics/:topicId')
  async updateTopicProgress(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Param('topicId') topicId: string,
    @Body() dto: UpdateTopicProgressDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.progressService.updateTopicProgress(
      req.user.sub,
      containerId,
      lessonId,
      topicId,
      dto,
    );
  }

  /**
   * Get lesson specific progress
   * GET /containers/:containerId/lessons/:lessonId/progress/details
   */
  @Get('details')
  async getLessonProgress(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.progressService.getLessonProgress(
      req.user.sub,
      containerId,
      lessonId,
    );
  }

  /**
   * Complete a review session for this lesson
   * POST /containers/:containerId/lessons/:lessonId/progress/review
   */
  @Post('review')
  async completeReview(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.progressService.completeReview(
      req.user.sub,
      containerId,
      lessonId,
    );
  }
}

@Controller('progress')
@UseGuards(JwtGuard)
export class UserProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /**
   * Get due reviews for today (Dashboard - Today's Review section)
   * GET /progress/due-reviews
   */
  @Get('due-reviews')
  async getDueReviews(@Request() req: AuthenticatedRequest) {
    return this.progressService.getDueReviews(req.user.sub);
  }

  /**
   * Get user's overall statistics
   * GET /progress/stats
   */
  @Get('stats')
  async getUserStats(@Request() req: AuthenticatedRequest) {
    return this.progressService.getUserStats(req.user.sub);
  }

  /**
   * Get all user's progress records
   * GET /progress
   */
  @Get()
  async getUserProgress(@Request() req: AuthenticatedRequest) {
    return this.progressService.getUserProgress(req.user.sub);
  }
}
