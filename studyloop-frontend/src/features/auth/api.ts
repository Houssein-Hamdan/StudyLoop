import { apiClient } from '../../lib/api/client';

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from './types';

export async function login(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const response = await apiClient.post(
    '/auth/login',
    payload,
  );

  return response.data;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await apiClient.post(
    '/auth/register',
    payload,
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get('/auth/me');

  return response.data;
}