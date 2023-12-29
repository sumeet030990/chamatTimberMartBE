import { Prisma, PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { fetchQueryParamsType } from '../../types/commons';
import { fetchItemQueryParamsType } from '../../types/itemTypes';
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
 *
 * @param queryParams
 * @returns
 */
const fetchAllItemsAutocomplete = async (queryParams: fetchItemQueryParamsType) => {
  try {
    const { itemType } = queryParams;
    const itemTypeCondition = itemType === 'all' ? {} : { item_type: itemType };

    // add item condition

    const result = await prisma.item.findMany({
      where: {
        deleted_at: null,
        status: true,
        ...itemTypeCondition,
      },
      select: {
        id: true,
        name: true,
        item_type: true,
        length: true,
        width: true,
        height: true,
      },
    });

    return result;
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
const storeItem = async (data: Prisma.ItemCreateInput, prismaTx: any = prisma) => {
  try {
    const result = await prismaTx.item.create({
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
  fetchAllItemsAutocomplete,
  findById,
  storeItem,
  updateItem,
  destroyItem,
};
