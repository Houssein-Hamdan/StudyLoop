import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '../src/app.module.js';

describe('Auth Integration', () => {
  let app: INestApplication<App>;

  const email = `integration-${Date.now()}@test.com`;

  beforeAll(async () => {

    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'Password123!',
        firstName: 'Integration',
        lastName: 'Test',
      })
      .expect(201);

    expect(response.body.message).toBe(
      'User registered successfully',
    );

    expect(response.body.user).toEqual(
      expect.objectContaining({
        email,
        firstName: 'Integration',
        lastName: 'Test',
      }),
    );

    expect(response.body.user).not.toHaveProperty('password');
  });

  it('should reject duplicate email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'Password123!',
        firstName: 'Another',
        lastName: 'User',
      })
      .expect(409);

    expect(response.body.message).toBeDefined();
  });

  it('should login the registered user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'Password123!',
      })
      .expect(201);

    expect(response.body.access_token).toBeDefined();

    expect(response.body.user).toEqual(
      expect.objectContaining({
        email,
        firstName: 'Integration',
        lastName: 'Test',
      }),
    );
  });

  it('should reject invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'WrongPassword!',
      })
      .expect(401);
  });

  it('should get the current user with a valid JWT', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'Password123!',
      })
      .expect(201);

    const token = loginResponse.body.access_token;

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: loginResponse.body.user.id,
        email,
        firstName: 'Integration',
        lastName: 'Test',
      }),
    );
  });

  it('should reject /auth/me without a JWT', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);
  });
});