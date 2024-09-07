import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';

let dbUrl: string;

switch (environment) {
  case 'development':
    dbUrl = process.env.DATABASE_URL_DEV!;
    break;
  case 'test':
    dbUrl = process.env.DATABASE_URL_TEST!;
    break;
  case 'production':
    dbUrl = process.env.DATABASE_URL_PROD!;
    break;
  default:
    throw new Error(`Unknown environment: ${environment}`);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

export { prisma };
