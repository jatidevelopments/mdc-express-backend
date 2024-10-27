import { PrismaClient } from '@prisma/client';
import logger from './logger.service';

const prisma = new PrismaClient();

export const connectDatabase = async () => {
  try {
    logger.info('Connecting to database...');
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error((err as Error).message);
    process.exit(1);
  }
};

export default prisma;