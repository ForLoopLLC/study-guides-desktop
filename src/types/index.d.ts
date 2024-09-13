import type {
  TagType as PrismaTagType,
  ContentRatingType,
} from '@prisma/client';
export * from './user';
export * from './tag';
export * from './search';

export type Channels =
  | 'navigate'
  | 'connection'
  | 'env-update'
  | 'update-tags'
  | 'get-tags'
  | 'publish-index'
  | 'update-tag'
  | 'publish-index-progress'
  | 'publish-index-complete'
  | 'publish-index-error';

export interface Environment {
  env: 'development' | 'test' | 'production' | null;
  algoliaAdminKey: string | null;
  algoliaAppId: string | null;
  openAiApiKey: string | null;
  openAiModel: string | null;
  url: string | null;
}

export interface PostgresConnectionInfo {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

// types/PaginatedResult.ts
export interface PaginatedResult<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export type TagFilter = PrismaTagType | 'All';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose' | 'silly';
