import { User } from '../../../entities/user.entity.js';

export const AUTH_USER_REPOSITORY = Symbol(
 'AUTH_USER_REPOSITORY',
);

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
}