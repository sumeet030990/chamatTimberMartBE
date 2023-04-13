import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

const prisma = new PrismaClient();

/**
 * Fetch All Roles
 * @param queryParams
 * @returns
 */
const fetchAllRoles = async () => {
  try {
    const result = await prisma.roles.findMany({});

    return {
      data: result,
    };
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

export default {
  fetchAllRoles,
};
