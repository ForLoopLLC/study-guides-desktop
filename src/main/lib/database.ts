import { BrowserWindow } from 'electron';
import { PrismaClient } from '@prisma/client';

class PrismaManager {
  private static instance: PrismaManager;
  private prisma: PrismaClient | null = null;
  private environment: 'development' | 'test' | 'production' = 'development';

  private constructor() {
    console.log('PrismaManager constructor');
    this.setPrismaClient(this.environment); // Initialize with default environment
  }

  // Get the singleton instance
  public static getInstance(): PrismaManager {
    if (!PrismaManager.instance) {
      PrismaManager.instance = new PrismaManager();
    }
    return PrismaManager.instance;
  }

  // Get the current Prisma client
  public getPrismaClient(): PrismaClient {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized.');
    }
    return this.prisma;
  }

  // Set the Prisma client based on environment
  public setPrismaClient(env: 'development' | 'test' | 'production'): void {
    this.environment = env;
    const databaseUrl = this.getDatabaseUrl(env);
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  // Get the current environment
  public getEnvironment(): string {
    return this.environment;
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
}

export const prismaManager = PrismaManager.getInstance();
