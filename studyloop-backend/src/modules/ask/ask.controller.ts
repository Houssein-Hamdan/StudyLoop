import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AskService } from './ask.service.js';
import { CreateQuestionDto } from './dto/create-question.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    sub: string;
  };
}

@Controller('containers/:containerId/lessons/:lessonId/ask')
@UseGuards(JwtGuard)
export class AskController {
  constructor(private readonly askService: AskService) {}

  /**
   * Ask a question about a lesson
   * POST /containers/:containerId/lessons/:lessonId/ask
   */
  @Post()
  async askQuestion(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Body() createQuestionDto: CreateQuestionDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.askService.askQuestion(
      req.user.sub,
      containerId,
      lessonId,
      createQuestionDto,
    );
  }

  /**
   * Get all questions for a lesson
   * GET /containers/:containerId/lessons/:lessonId/ask
   */
  @Get()
  async getLessonQuestions(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.askService.getLessonQuestions(
      lessonId,
      containerId,
      req.user.sub,
    );
  }

  /**
   * Get a specific question
   * GET /containers/:containerId/lessons/:lessonId/ask/:id
   */
  @Get(':id')
  async getQuestion(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Param('id') questionId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.askService.getQuestion(
      questionId,
      lessonId,
      containerId,
      req.user.sub,
    );
  }

  /**
   * Delete a question
   * DELETE /containers/:containerId/lessons/:lessonId/ask/:id
   */
  @Delete(':id')
  async deleteQuestion(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Param('id') questionId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.askService.deleteQuestion(
      questionId,
      lessonId,
      containerId,
      req.user.sub,
    );
  }
}

@Controller('questions')
@UseGuards(JwtGuard)
export class UserQuestionsController {
  constructor(private readonly askService: AskService) {}

  /**
   * Get all user's questions across all lessons
   * GET /questions
   */
  @Get()
  async getUserQuestions(@Request() req: AuthenticatedRequest) {
    return this.askService.getUserQuestions(req.user.sub);
  }
}