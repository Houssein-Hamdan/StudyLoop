import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import type { Request } from 'express';
import { ContainerService } from './container.service.js';
import { CreateContainerDto } from './dto/create-container.dto.js';
import { UpdateContainerDto } from './dto/update-container.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
  };
}

@Controller('containers')
@UseGuards(JwtGuard)
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  // Create a new container -> POST /containers
  @Post()
  async createContainer(
    @Body() createContainerDto: CreateContainerDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.containerService.createContainer(
      req.user.sub,
      createContainerDto,
    );
  }

  /**
   * Get all containers for the current user
   * GET /containers
   */
  @Get()
  async getContainers(@NestRequest() req: AuthenticatedRequest) {
    return this.containerService.getContainers(req.user.sub);
  }

  /**
   * Get a specific container
   * GET /containers/:id
   */
  @Get(':id')
  async getContainer(
    @Param('id') containerId: string,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.containerService.getContainer(containerId, req.user.sub);
  }

  /**
   * Update a container
   * PUT /containers/:id
   */
  @Put(':id')
  async updateContainer(
    @Param('id') containerId: string,
    @Body() updateContainerDto: UpdateContainerDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.containerService.updateContainer(
      containerId,
      req.user.sub,
      updateContainerDto,
    );
  }

  /**
   * Delete a container
   * DELETE /containers/:id
   */
  @Delete(':id')
  async deleteContainer(
    @Param('id') containerId: string,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.containerService.deleteContainer(containerId, req.user.sub);
  }
}
