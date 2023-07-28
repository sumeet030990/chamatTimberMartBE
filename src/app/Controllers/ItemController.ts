import { Request, Response } from 'express';
import { successResponse } from '../../utils/helpers';
import { storeRequest } from '../FormValidators/ItemFormValidator';
import ItemService from '../Services/ItemService';

/**
 * Fetch all Item data
 * @param req
 * @param res
 * @param next
 * @returns
 */
const index = async (req: Request, res: Response, next: any) => {
  try {
    const reqQuery: any = req.query;
    let itemData: any = [];

    if (reqQuery.autocomplete) {
      itemData = await ItemService.fetchAllItemsAutocomplete(reqQuery);

      return res.json(successResponse(itemData));
    }
    itemData = await ItemService.fetchAllItems(reqQuery);

    return res.json(successResponse(itemData.data));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Get Details of the Item of given id
 * @param req
 * @param res
 * @param next
 */
const show = async (req: Request, res: Response, next: any) => {
  try {
    const itemData = await ItemService.findById(req.params.id);

    return res.json(successResponse(itemData));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Store Item data in Db
 * @param req
 * @param res
 * @param next
 * @returns
 */
const store = async (req: Request, res: Response, next: any) => {
  try {
    const { body } = req;
    const validationResult = await storeRequest.validateAsync(body);

    const saveItem = ItemService.storeItem(validationResult);

    return res.json(successResponse(saveItem));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Update the data of the id given
 * @param req
 * @param res
 * @param next
 */
const update = async (req: Request, res: Response, next: any) => {
  try {
    const { body, params } = req;
    const validateData = await storeRequest.validateAsync(body);

    const updateItem = await ItemService.updateItem(params.id, validateData);

    return res.json(successResponse({ updateUser: updateItem }));
  } catch (error: any) {
    next(error);
  }
};

/**
 * Destroy the item
 * @param req
 * @param res
 * @param next
 */
const destroy = async (req: Request, res: Response, next: any) => {
  try {
    const { params } = req;

    const destroyItem = await ItemService.destroyItem(params.id);

    return res.json(successResponse({ destroyItem }));
  } catch (error: any) {
    next(error);
  }
};

export default {
  index,
  show,
  store,
  update,
  destroy,
};
