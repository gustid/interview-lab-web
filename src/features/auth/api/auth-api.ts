import apiClient from '../../../api/client';

import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  User,
} from '../auth.types';

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', input);
  return response.data;
}

export async function register(input: RegisterInput): Promise<User> {
  const response = await apiClient.post<User>('/auth/register', input);

  return response.data;
}

// todo implement logout when we have httpOnly cookies
export async function logout(): Promise<void> {}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
}
