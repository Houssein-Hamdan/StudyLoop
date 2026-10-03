// src/modules/lesson/public-lesson.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { LessonService } from './lesson.service.js';

@Controller('lessons') 
export class PublicLessonController {
  constructor(private readonly lessonService: LessonService) {}

  /**
   * Get Shared Lesson (Public Endpoint - No JWT Required)
   * GET /lessons/share/:shareToken
   */
  @Get('share/:shareToken')
  async getSharedLesson(@Param('shareToken') shareToken: string) {
    return await this.lessonService.getSharedLesson(shareToken);
  }
}