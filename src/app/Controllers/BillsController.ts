import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { isInteger } from 'lodash';
import { getAuthUserFromHeaders, successResponse } from '../../utils/helpers';
import { storeRequest, updateRequest } from '../FormValidators/BillFormValidator';
import BillsService from '../Services/BillsService';
import ItemService from '../Services/ItemService';
import UserService from '../Services/UserService';

const index = async (req: Request, res: Response, next: any) => {
  try {
    const reqQuery: any = req.query;
    const data = await BillsService.fetchAllBills(reqQuery);

    return res.json(successResponse(data));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Get Details of the Bill of given id
 * @param req
 * @param res
 * @param next
 */
const show = async (req: Request, res: Response, next: any) => {
  try {
    const companyData = await BillsService.findById(req.params.id);

    return res.json(successResponse(companyData));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Post api for Storing Bill in DB
 * @param req Request
 * @param res Response
 * @param next
 * @returns Response
 */
const store = async (req: Request, res: Response, next: any) => {
  try {
    const { body, headers } = req;
    const {
      customer_details,
      customer_details: { user },
      items,
    } = body;
    const validationResult = await storeRequest.validateAsync(body);

    if (headers.authorization) {
      const loggingUser: any = getAuthUserFromHeaders(headers);
      customer_details.created_by = loggingUser.id;
      validationResult.created_by = loggingUser.id;
    }

    let savedUser = customer_details.user[0];
    // if user is new then add it to the DB
    if (user[0].customOption) {
      const formattedUserData = UserService.formatUserDataFromBill(customer_details);
      // save user data
      const savedUserResult = await UserService.storeUser(formattedUserData);
      savedUser = [
        {
          label: savedUserResult.name,
          value: savedUserResult.id,
        },
      ];
    }

    // check if there's new item added, if yes then save it in item database
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const element = items[itemIndex];
      const itemData = element.item[0];

      if (!isInteger(itemData.value)) {
        if (itemData.value.includes('custom')) {
          const formattedItemData = ItemService.formatItemDataforStore(itemData);
          const item = await ItemService.storeItem(formattedItemData);
          items[itemIndex].item = [
            {
              value: item.id,
              label: item.name,
              type: item.item_type,
              length: item.length,
              width: item.width,
              height: item.height,
            },
          ];
        }
      }
    }
    validationResult.items = items;
    // save data in bill
    const saveBill = await BillsService.storeBill(savedUser, validationResult);

    return res.json(successResponse({ saveBill }));
  } catch (error: any) {
    return next(new createHttpError.InternalServerError(error.message));
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
    const { body, params, headers } = req;
    const {
      customer_details,
      customer_details: { user },
      items,
    } = body;

    const validateData = await updateRequest.validateAsync(body);
    if (headers.authorization) {
      const loggingUser: any = getAuthUserFromHeaders(headers);
      customer_details.created_by = loggingUser.id;
      validateData.created_by = loggingUser.id;
    }

    let savedUser = customer_details.user;
    // if user is new then add it to the DB
    if (user[0].customOption) {
      const formattedUserData = UserService.formatUserDataFromBill(customer_details);
      // save user data
      const savedUserResult = await UserService.storeUser(formattedUserData);
      savedUser = [
        {
          label: savedUserResult.name,
          value: savedUserResult.id,
        },
      ];
    }

    // check if there's new item added, if yes then save it in item database
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const element = items[itemIndex];
      const itemData = element.item[0];

      if (!isInteger(itemData.value)) {
        if (itemData.value.includes('custom')) {
          const formattedItemData = ItemService.formatItemDataforStore(itemData);
          const item = await ItemService.storeItem(formattedItemData);
          items[itemIndex].item = [
            {
              value: item.id,
              label: item.name,
              type: item.item_type,
              length: item.length,
              width: item.width,
              height: item.height,
            },
          ];
        }
      }
    }
    validateData.items = items;
    const updateBill = await BillsService.updateBill(params.id, savedUser, validateData);

    return res.json(successResponse(updateBill));
  } catch (error: any) {
    next(error);
  }
};

/**
 * Delete Bill from DB
 *
 * @param req Request
 * @param res Response
 * @param next any
 * @returns Response
 */
const destroy = async (req: Request, res: Response, next: any): Promise<Response> => {
  try {
    const { id } = req.params;
    const result = await BillsService.deleteBill(id);

    return res.json(successResponse({ result }));
  } catch (error: any) {
    return next(new createHttpError.InternalServerError(error.message));
  }
};
export default {
  index,
  show,
  store,
  update,
  destroy,
};
