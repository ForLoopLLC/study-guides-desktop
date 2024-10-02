import type { TagType as PrismaTagType } from '@prisma/client';

import log from 'electron-log';

export * from './user';
export * from './tag';
export * from './search';
export * from './ai';
export * from './import';
export * from './export';

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

export interface CursorResult<T> {
  nextCursor: string | null;
  data: T[];
}

export type TagFilter = PrismaTagType | 'All' | 'Reported';
export type UserFilter = 'All' | 'Admin' | 'User' | 'Tester' | 'Freelancer';
export type QuestionFilter =
  | 'All'
  | 'Reported'
  | 'MissingLearnMore'
  | 'MissingDistractors';

export type LogLevel =
  | 'info'
  | 'warn'
  | 'error'
  | 'debug'
  | 'verbose'
  | 'silly';

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

export interface Feedback {
  message: string;
  success: boolean;
  level: 'info' | 'error' | 'warning' | 'trace';
  dateTime: Date;
}

