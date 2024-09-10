import { PrismaClient } from '@prisma/client';

// Create a Prisma client instance
let prisma: PrismaClient | null = null;

// Function to instantiate PrismaClient based on the environment
export const getPrismaClient = (env: 'development' | 'test' | 'production') => {
  let databaseUrl: string;

  switch (env) {
    case 'development':
      databaseUrl = process.env.DATABASE_URL_DEV!;
      break;
    case 'test':
      databaseUrl = process.env.DATABASE_URL_TEST!;
      break;
    case 'production':
      databaseUrl = process.env.DATABASE_URL_PROD!;
      break;
    default:
      throw new Error('Invalid environment');
  }

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  return prisma;
};
