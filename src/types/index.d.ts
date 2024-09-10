export * from './user';

export type Channels = 'navigate' | 'connection' | 'env-update';

export interface Environment {
    env: "development" | "test" | "production" | null
    url: string | null;
}
