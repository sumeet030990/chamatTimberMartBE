import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

const prisma = new PrismaClient();

/**
 * Fetch All Languages
 * @param queryParams
 * @returns
 */
const fetchAllLanguages = async () => {
  try {
    const result = await prisma.languages.findMany({});

    return {
      data: result,
    };
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

export default {
  fetchAllLanguages,
};
