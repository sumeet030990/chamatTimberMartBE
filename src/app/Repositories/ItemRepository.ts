import { Prisma, PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { fetchQueryParamsType } from '../../types/commons';
import { getCurrentDate } from '../../utils/dateTimeConversions';

const prisma = new PrismaClient();

/**
 * Fetch All Items
 * @param queryParams
 * @returns
 */
const fetchAllItems = async (reqQuery: fetchQueryParamsType) => {
  try {
    const { pageNumber, pageSize, sort_field, sort_order, search } = reqQuery;
    const searchCondition: any = search;

    const result = await prisma.item.findMany({
      where: {
        deleted_at: null,
        // search
        ...searchCondition,
      },
      skip: Number((pageNumber - 1) * pageSize),
      take: Number(pageSize),
      orderBy: {
        [sort_field]: sort_order,
      },
    });

    return {
      data: result,
    };
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Fetch Data By id
 * @param id
 * @returns Item
 */
const findById = async (id: string) => {
  try {
    const result = await prisma.item.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Store Item in DB
 * @param data
 * @returns
 */
const storeItem = async (data: Prisma.ItemCreateInput) => {
  try {
    const result = await prisma.item.create({
      data,
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Update Item
 * @param itemId
 * @param data
 * @returns
 */
const updateItem = async (itemId: string, data: any) => {
  const result = await prisma.item.update({
    where: {
      id: Number(itemId),
    },
    data,
  });

  return result;
};

/**
 * Delete Item
 * @param itemId
 * @param data
 * @returns
 */
const destroyItem = async (itemId: string) => {
  const result = await prisma.item.update({
    where: {
      id: Number(itemId),
    },
    data: {
      deleted_at: getCurrentDate(),
    },
  });

  return result;
};

export default {
  fetchAllItems,
  findById,
  storeItem,
  updateItem,
  destroyItem,
};
