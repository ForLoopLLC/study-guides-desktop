import type {
  TagType as PrismaTagType
} from '@prisma/client';

import log from 'electron-log';

export * from './user';
export * from './tag';
export * from './search';
export * from './ai';

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
  | 'publish-index-error'
  | 'log-update';

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

export type TagFilter = PrismaTagType | 'All' | "Reported";

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose' | 'silly';



export interface LoggerWithCategory {
  info: (category: string | null, message: string) => void;
  warn: (category: string | null, message: string) => void;
  error: (category: string | null, message: string) => void;
  debug: (category: string | null, message: string) => void;
  verbose: (category: string | null, message: string) => void;
  silly: (category: string | null, message: string) => void;
  transports: typeof log.transports;
  original: typeof log;
}

