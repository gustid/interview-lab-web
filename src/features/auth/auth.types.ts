export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// @todo: change to httpOnly cookie instead of returning accessToken in response body
export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}
