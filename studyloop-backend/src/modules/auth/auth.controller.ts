import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtGuard } from './guards/jwt.guard.js';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /auth/register
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Login user
   * POST /auth/login
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Get current user profile
   * GET /auth/me
   * Protected with JWT
   */
  @Get('me')
  @UseGuards(JwtGuard)
  async getCurrentUser(@NestRequest() req: AuthenticatedRequest) {
    return this.authService.getCurrentUser(req.user.sub);
  }
}