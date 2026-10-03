import { Container } from '../../../entities/container.entity.js';

export const CONTAINER_REPOSITORY = Symbol('CONTAINER_REPOSITORY');

export interface IContainerRepository {
  findById(id: string): Promise<Container | null>;
  findByIdAndUserId(id: string, userId: string): Promise<Container | null>;
  findAllByUserId(userId: string): Promise<Container[]>;
  create(container: Partial<Container>): Promise<Container>;
  update(id: string, container: Partial<Container>): Promise<Container>;
  delete(id: string): Promise<boolean>;
  belongsToUser(containerId: string, userId: string): Promise<boolean>;
}
