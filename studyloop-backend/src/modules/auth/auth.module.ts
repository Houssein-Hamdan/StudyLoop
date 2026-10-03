import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';

import { User } from '../../entities/user.entity.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserRepository } from './repositories/user.repository.js';
import { HashService } from './hash.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { JwtGuard } from './guards/jwt.guard.js'; 
import { AUTH_USER_REPOSITORY } from './repositories/user.repository.interface.js';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret_key',
      signOptions: { expiresIn: (process.env.JWT_EXPIRATION || '7d') as any },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashService,
    JwtStrategy,
    JwtGuard,
    {
      provide: AUTH_USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [AuthService, JwtGuard, PassportModule],
})
export class AuthModule {}
