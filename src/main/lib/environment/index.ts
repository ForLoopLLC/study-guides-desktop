import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { Environment } from '../../../types';

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private prisma: PrismaClient | null = null;
  private ai: OpenAI | null = null;
  private environment: 'development' | 'test' | 'production' = 'development';
  private url: string = '';
  private algoliaAdminKey: string = '';
  private algoliaAppId: string = '';
  private openAiApiKey: string = '';
  private openAiModel: string = '';

  private constructor() {
    this.setEnvironment(this.environment); // Initialize with default environment
  }

  // Get the singleton instance
  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  // Get the current Prisma client
  public getPrismaClient(): PrismaClient {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized.');
    }
    return this.prisma;
  }

  public getAiClient(): OpenAI {
    if (!this.ai) {
      throw new Error('AI client not initialized.');
    }
    return this.ai;
  }

  public getAlgoliaBaseUrl(): string {
    return `https://${this.algoliaAppId}.algolia.net`;
  }

  public getAlgoliaHeaders(): Record<string, string> {
    return {
      'X-Algolia-API-Key': this.algoliaAdminKey,
      'X-Algolia-Application-Id': this.algoliaAppId,
      'Content-Type': 'application/json',
    };
  }

  //
  public setEnvironment(env: 'development' | 'test' | 'production'): void {
    this.environment = env;
    this.url = this.getDatabaseUrl(env);
    this.algoliaAdminKey = this.getAlgoliaAdminKey(env);
    this.algoliaAppId = this.getAlgoliaAppId(env);
    this.openAiApiKey = this.getOpenAiKey(env);
    this.openAiModel = this.getOpenAiModel(env);
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: this.url,
        },
      },
    });
    this.ai = new OpenAI({ apiKey: this.getOpenAiKey(env) });
  }

  // Get the current environment
  public getEnvironment(): Environment {
    return {
      env: this.environment,
      url: this.url,
      algoliaAdminKey: this.algoliaAdminKey,
      algoliaAppId: this.algoliaAppId,
      openAiApiKey: this.openAiApiKey,
      openAiModel: this.openAiModel,
    };
  }

  // Get database URL based on environment
  private getDatabaseUrl(env: 'development' | 'test' | 'production'): string {
    switch (env) {
      case 'development':
        return process.env.DATABASE_URL_DEV!;
      case 'test':
        return process.env.DATABASE_URL_TEST!;
      case 'production':
        return process.env.DATABASE_URL_PROD!;
      default:
        throw new Error('Invalid environment');
    }
  }

  private getAlgoliaAdminKey(
    env: 'development' | 'test' | 'production',
  ): string {
    switch (env) {
      case 'development':
        return process.env.ALGOLIA_ADMIN_API_KEY_DEV!;
      case 'test':
        return process.env.ALGOLIA_ADMIN_API_KEY_TEST!;
      case 'production':
        return process.env.ALGOLIA_ADMIN_API_KEY_PROD!;
      default:
        throw new Error('Invalid environment');
    }
  }

  private getAlgoliaAppId(env: 'development' | 'test' | 'production'): string {
    switch (env) {
      case 'development':
        return process.env.ALGOLIA_APP_ID_DEV!;
      case 'test':
        return process.env.ALGOLIA_APP_ID_TEST!;
      case 'production':
        return process.env.ALGOLIA_APP_ID_PROD!;
      default:
        throw new Error('Invalid environment');
    }
  }

  private getOpenAiKey(env: 'development' | 'test' | 'production'): string {
    switch (env) {
      case 'development':
        return process.env.OPENAI_API_KEY_DEV!;
      case 'test':
        return process.env.OPENAI_API_KEY_TEST!;
      case 'production':
        return process.env.OPENAI_API_KEY_PROD!;
      default:
        throw new Error('Invalid environment');
    }
  }

  private getOpenAiModel(env: 'development' | 'test' | 'production'): string {
    switch (env) {
      case 'development':
        return process.env.OPENAI_MODEL_DEV!;
      case 'test':
        return process.env.OPENAI_MODEL_TEST!;
      case 'production':
        return process.env.OPENAI_MODEL_PROD!;
      default:
        throw new Error('Invalid environment');
    }
  }
}

export const environmentManager = EnvironmentManager.getInstance();
