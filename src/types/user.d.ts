import type {
  User as PrismaUser,
  Role as PrismaRole,
  UserRole as PrismaUserRole,
} from '@prisma/client';

export type RoleName = 'user' | 'admin' | 'freelancer' | 'tester';
export type Cuid = string;
export type UserId = Cuid;

export interface Role extends PrismaRole {}

export interface UserRole extends PrismaUserRole {
  role: Role;
}

export interface User extends Omit<PrismaUser, 'roles'> {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  roles: UserRole[];
  emailVerified: Date | null;
  stripeCustomerId: string | null;
}

export interface UpdateUserInput {
  id: string;
  gamerTag?: string;
  roles?: UserRole[];
  metadata?: any; // Assuming metadata is a JSON object
}

export type AlgoliaUserRecord = {
  objectID: string;
  id: string;
  name: string | null;
  gamerTag: string | null;
  email: string | null;
  image: string | null;
  stripeCustomerId: string | null;
};
