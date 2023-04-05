import { Prisma, PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { fetchQueryParamsType } from '../../types/commons';

const prisma = new PrismaClient();

/**
 * Fetch All Users
 * @param queryParams
 * @returns
 */
const fetchAllUsers = async (queryParams: fetchQueryParamsType) => {
  try {
    const { pageNumber, pageSize, sort_field, sort_order } = queryParams;
    const result = await prisma.users.findMany({
      where: {
        deleted_at: null,
      },
      skip: Number((pageNumber - 1) * pageSize),
      take: Number(pageSize),
      orderBy: {
        [sort_field]: sort_order,
      },
    });

    const count = await prisma.users.count({});

    return {
      data: result,
      count,
    };
    // return {
    //   page: pageNumber,
    //   size: pageSize,
    //   total_records: count,
    //   total_page: Math.ceil(count / pageSize),
    //   data: result,
    // };
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Fetch all Details but omit protected fields like password
 * In update scenario we need to avoid throwing unique user_name error for self profile
 * @param userName
 * @returns
 */
const fetchUserByUserName = async (userName: string, selfUserId: string = '') => {
  try {
    const excludeSelfUser: any = {};

    if (selfUserId !== '') {
      excludeSelfUser.id = {
        not: Number(selfUserId),
      };
    }

    const result = await prisma.users.findFirst({
      where: {
        user_name: userName,
        deleted_at: null,
        ...excludeSelfUser,
      },
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Store User in DB
 * @param userData
 * @returns
 */
const storeUser = async (userData: Prisma.usersCreateInput) => {
  try {
    const savedUser = await prisma.users.create({
      data: userData,
    });

    return savedUser;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Update User in Db
 * @param id string
 * @param data object
 * @returns
 */
const updateUser = async (id: string, data: any) => {
  try {
    const [result] = await prisma.$transaction([
      prisma.users.update({
        where: {
          id: Number(id),
        },
        data,
      }),
    ]);

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Soft Delete User in DB
 *
 * @param userId string
 * @param loggedInUser string
 * @returns
 */
const deleteUser = async (userId: string, loggedInUser: any = {}) => {
  try {
    const deleteResult = await prisma.users.update({
      where: {
        id: Number(userId),
      },
      data: {
        deleted_at: new Date(),
        deleted_by: loggedInUser?.id,
      },
    });

    return deleteResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};
export default {
  fetchAllUsers,
  fetchUserByUserName,
  storeUser,
  updateUser,
  deleteUser,
};
