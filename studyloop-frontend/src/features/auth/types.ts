export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthResponse = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  user?: User;
};