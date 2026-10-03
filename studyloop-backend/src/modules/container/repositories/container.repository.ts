import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Container } from '../../../entities/container.entity.js';
import { IContainerRepository } from './container.repository.interface.js';

@Injectable()
export class ContainerRepository implements IContainerRepository {
  constructor(
    @InjectRepository(Container)
    private readonly repository: Repository<Container>,
  ) {}

  async findById(id: string): Promise<Container | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Container | null> {
    return this.repository.findOne({ where: { id, userId } });
  }

  async findAllByUserId(userId: string): Promise<Container[]> {
    return this.repository.find({ where: { userId } });
  }

  async create(container: Partial<Container>): Promise<Container> {
    const newContainer = this.repository.create(container);
    return this.repository.save(newContainer);
  }

  async update(id: string, container: Partial<Container>): Promise<Container> {
    await this.repository.update(id, container);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Container not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async belongsToUser(containerId: string, userId: string): Promise<boolean> {
    if (!containerId || containerId === 'undefined') {
      return false;
    }

    const container = await this.repository.findOne({
      where: { id: containerId, userId },
    });

    return !!container;
  }
}
