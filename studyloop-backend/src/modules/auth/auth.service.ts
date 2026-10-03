import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

import { AUTH_USER_REPOSITORY } from './repositories/user.repository.interface.js';
import type { IUserRepository } from './repositories/user.repository.interface.js'; // <-- IUserRepository msh UserRepository[cite: 8]

import { HashService } from './hash.service.js';
import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  UserNotFoundException,
} from '../../exceptions/auth.exceptions.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @returns User data, access token, and success message
   */
  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsException(email);
    }

    // Hash password
    const hashedPassword = await this.hashService.hashPassword(password);

    // Create and save user
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Generate JWT token
    const accessToken = this.generateToken(user.id, user.email);

    return {
      message: 'User registered successfully',
      access_token: accessToken,
      token: accessToken, 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Login user with email and password
   * @param loginDto - User login credentials
   * @returns Access token and user data
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Verify password
    const isPasswordValid = await this.hashService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generate JWT token
    const accessToken = this.generateToken(user.id, user.email);

    return {
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Get current user by ID
   * @param userId - User ID
   * @returns User data
   */
  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  /**
   * Generate JWT token
   * @param userId - User ID
   * @param email - User email
   * @returns JWT token
   */
  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({
      sub: userId,
      email: email,
    });
  }

  /**
   * Format user response
   * @param user - User entity
   * @param message - Response message
   * @returns Formatted response
   */
}
