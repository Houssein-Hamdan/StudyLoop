import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { QuizService } from './quiz.service.js';
import { CreateQuizDto } from './dto/create-quiz.dto.js';
import { SubmitQuizDto } from './dto/submit-quiz.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { ParseUUIDPipe } from '@nestjs/common';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    [key: string]: any;
  };
}

@Controller('containers/:containerId/lessons/:lessonId/quizzes')
@UseGuards(JwtGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  /**
   * Create and generate a new quiz
   * POST /containers/:containerId/lessons/:lessonId/quizzes
   */
  @Post()
  async createQuiz(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Body() createQuizDto: CreateQuizDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.quizService.createQuiz(
      req.user.sub,
      containerId,
      lessonId,
      createQuizDto,
    );
  }

  @Get()
  async getLessonQuizzes(
    @Param('containerId', ParseUUIDPipe)
    containerId: string,

    @Param('lessonId', ParseUUIDPipe)
    lessonId: string,

    @Req() req: AuthenticatedRequest,
  ) {
    return this.quizService.getLessonQuizzes(
      lessonId,
      containerId,
      req.user.sub,
    );
  }

  /**
   * Get a quiz with questions (without correct answers)
   * GET /containers/:containerId/lessons/:lessonId/quizzes/:id
   */

  @Get(':id')
  async getQuiz(
    @Param('containerId', ParseUUIDPipe) containerId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Param('id', ParseUUIDPipe) quizId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.quizService.getQuiz(
      quizId,
      lessonId,
      containerId,
      req.user.sub,
    );
  }

  /**
   * Submit quiz answers and get results
   * POST /containers/:containerId/lessons/:lessonId/quizzes/submit
   */
  @Post(':id/submit')
  async submitQuiz(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Param('id') quizId: string,
    @Body() submitQuizDto: SubmitQuizDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.quizService.submitQuiz(
      quizId,
      req.user.sub,
      containerId,
      lessonId,
      submitQuizDto,
    );
  }
}
