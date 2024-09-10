export * from './user';

export type Channels = 'navigate' | 'connection' | 'env-update';

export interface Environment {
    env: "development" | "test" | "production" | null
    url: string | null;
}

export interface PostgresConnectionInfo {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
  }
  
