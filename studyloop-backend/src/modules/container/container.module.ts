import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Container } from '../../entities/container.entity.js';
import { ContainerController } from './container.controller.js';
import { ContainerService } from './container.service.js';
import { ContainerRepository } from './repositories/container.repository.js';
import { CONTAINER_REPOSITORY } from './repositories/container.repository.interface.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Container]),AuthModule,],
  controllers: [ContainerController],
  providers: [
    ContainerService,
    {
      provide: CONTAINER_REPOSITORY,
      useClass: ContainerRepository,
    },
  ],
  exports: [ContainerService,CONTAINER_REPOSITORY,],
})
export class ContainerModule {}