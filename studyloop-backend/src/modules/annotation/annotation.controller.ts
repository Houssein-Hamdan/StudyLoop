import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AnnotationService } from './annotation.service.js';
import { CreateAnnotationDto } from './dto/create-annotation.dto.js';
import { UpdateAnnotationDto } from './dto/update-annotation.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import type { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    sub: string;
  };
}

@Controller('lessons/:lessonId/annotations')
@UseGuards(JwtGuard)
export class AnnotationController {
  constructor(private readonly annotationService: AnnotationService) {}

  @Post()
  async create(
    @Param('lessonId') lessonId: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateAnnotationDto,
  ) {
    return await this.annotationService.create(req.user.sub, lessonId, dto);
  }

  @Get()
  async findByLesson(
    @Param('lessonId') lessonId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.annotationService.findByLesson(req.user.sub, lessonId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateAnnotationDto,
  ) {
    return await this.annotationService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return await this.annotationService.remove(id, req.user.sub);
  }
}
