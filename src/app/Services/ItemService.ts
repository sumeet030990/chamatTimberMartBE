/* eslint-disable no-param-reassign */
import { Prisma } from '@prisma/client';
import { isUndefined } from 'lodash';
import { fetchQueryParamsType } from '../../types/commons';
import ItemRepository from '../Repositories/ItemRepository';

const getSearchCondtion = (reqQuery: fetchQueryParamsType) => {
  const { search } = reqQuery;

  if (isUndefined(search)) {
    reqQuery.search = {};

    return reqQuery;
  }

  reqQuery.search = {
    OR: [
      {
        name: {
          contains: search,
        },
      },
      {
        item_code: {
          contains: search,
        },
      },
    ],
  };

  return reqQuery;
};

/**
 * Fetch all Item Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllItems = (reqQuery: fetchQueryParamsType) => {
  reqQuery = getSearchCondtion(reqQuery);

  return ItemRepository.fetchAllItems(reqQuery);
};

/**
 * fetch Item by id
 * @returns
 */
const findById = (id: string) => {
  return ItemRepository.findById(id);
};

/**
 * Store Item in DB
 * @param data
 * @returns
 */
const storeItem = (data: Prisma.ItemCreateInput) => {
  return ItemRepository.storeItem(data);
};

/**
 * Update Item
 * @param itemId
 * @param data
 * @returns
 */
const updateItem = async (itemId: string, data: any) => {
  return ItemRepository.updateItem(itemId, data);
};

/**
 * Delete Item
 * @param itemId
 * @param data
 * @returns
 */
const destroyItem = async (itemId: string) => {
  return ItemRepository.destroyItem(itemId);
};
export default {
  fetchAllItems,
  findById,
  storeItem,
  updateItem,
  destroyItem,
};
