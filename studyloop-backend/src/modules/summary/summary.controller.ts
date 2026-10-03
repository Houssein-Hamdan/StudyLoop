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
import { Request as ExpressRequest } from 'express'; 
import { SummaryService } from './summary.service.js';
import { CreateSummaryDto } from './dto/create-summary.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    sub: string;
  };
}

@Controller('containers/:containerId/lessons/:lessonId/summaries')
@UseGuards(JwtGuard)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Post()
  async createSummary(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Body() createSummaryDto: CreateSummaryDto,
    @Request() req: AuthenticatedRequest, 
  ) {
    return this.summaryService.createSummary(
      req.user.sub,
      containerId,
      lessonId,
      createSummaryDto,
    );
  }

  @Get()
  async getSummaries(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Request() req: AuthenticatedRequest, 
  ) {
    return this.summaryService.getSummaries(
      lessonId,
      containerId,
      req.user.sub,
    );
  }

  @Get(':id')
  async getSummary(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Param('id') summaryId: string,
    @Request() req: AuthenticatedRequest, 
  ) {
    return this.summaryService.getSummary(
      summaryId,
      lessonId,
      containerId,
      req.user.sub,
    );
  }

  @Delete(':id')
  async deleteSummary(
    @Param('containerId') containerId: string,
    @Param('lessonId') lessonId: string,
    @Param('id') summaryId: string,
    @Request() req: AuthenticatedRequest, 
  ) {
    return this.summaryService.deleteSummary(
      summaryId,
      lessonId,
      containerId,
      req.user.sub,
    );
  }
}