import { Injectable , Inject} from '@nestjs/common';
import { CreateContainerDto } from './dto/create-container.dto.js';
import { UpdateContainerDto } from './dto/update-container.dto.js';
import { CONTAINER_REPOSITORY } from './repositories/container.repository.interface.js';
import type { IContainerRepository } from './repositories/container.repository.interface.js';
import {
  ContainerNotFoundException,
} from '../../exceptions/auth.exceptions.js';

@Injectable()
export class ContainerService {
  constructor(
    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepository: IContainerRepository,
  ) {}

  /**
   * Create a new container for the user
   * @param userId - User ID
   * @param createContainerDto - Container data
   * @returns Created container
   */
  async createContainer(
    userId: string,
    createContainerDto: CreateContainerDto,
  ) {
    const container = await this.containerRepository.create({
      name: createContainerDto.name,
      description: createContainerDto.description,
      userId,
    });

    return {
      message: 'Container created successfully',
      container: this.formatContainer(container),
    };
  }

  /**
   * Get all containers for a user
   * @param userId - User ID
   * @returns List of user containers
   */
  async getContainers(userId: string) {
    const containers = await this.containerRepository.findAllByUserId(userId);

    return {
      message: 'Containers retrieved successfully',
      count: containers.length,
      containers: containers.map(this.formatContainer),
    };
  }

  /**
   * Get a specific container (with ownership check)
   * @param containerId - Container ID
   * @param userId - User ID
   * @returns Container data
   */
  async getContainer(containerId: string, userId: string) {
    const container = await this.containerRepository.findByIdAndUserId(
      containerId,
      userId,
    );

    if (!container) {
      throw new ContainerNotFoundException();
    }

    return {
      message: 'Container retrieved successfully',
      container: this.formatContainer(container),
    };
  }

  /**
   * Update a container (with ownership check)
   * @param containerId - Container ID
   * @param userId - User ID
   * @param updateContainerDto - Updated data
   * @returns Updated container
   */
  async updateContainer(
    containerId: string,
    userId: string,
    updateContainerDto: UpdateContainerDto,
  ) {
    // Verify ownership
    const container = await this.containerRepository.findByIdAndUserId(
      containerId,
      userId,
    );

    if (!container) {
      throw new ContainerNotFoundException();
    }

    // Update container
    const updatedContainer = await this.containerRepository.update(
      containerId,
      updateContainerDto,
    );

    return {
      message: 'Container updated successfully',
      container: this.formatContainer(updatedContainer),
    };
  }

  /**
   * Delete a container (with ownership check)
   * @param containerId - Container ID
   * @param userId - User ID
   * @returns Success message
   */
  async deleteContainer(containerId: string, userId: string) {
    // Verify ownership
    const container = await this.containerRepository.findByIdAndUserId(
      containerId,
      userId,
    );

    if (!container) {
      throw new ContainerNotFoundException();
    }

    // Delete container
    const deleted = await this.containerRepository.delete(containerId);

    if (!deleted) {
      throw new ContainerNotFoundException();
    }

    return {
      message: 'Container deleted successfully',
    };
  }

  /**
   * Format container response
   * @param container - Container entity
   * @returns Formatted container
   */
  private formatContainer(container: any) {
    return {
      id: container.id,
      name: container.name,
      description: container.description,
      createdAt: container.createdAt,
      updatedAt: container.updatedAt,
    };
  }
}
