import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { isInteger } from 'lodash';
import { getAuthUserFromHeaders, successResponse } from '../../utils/helpers';
import { storeRequest, updateRequest } from '../FormValidators/BillFormValidator';
import BillsService from '../Services/BillsService';
import ItemService from '../Services/ItemService';
import UserCompanyService from '../Services/UserCompanyService';
import UserService from '../Services/UserService';

const prisma = new PrismaClient();

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
 * Check if there's a new user created by user
 * @param body
 * @returns
 */
const checkIfNewUser = async (selectedCompany: string, body: any, tx: any) => {
  const {
    customer_details,
    customer_details: { user },
  } = body;
  let savedUser = customer_details.user;

  // if custiomOption is true then it means that there's a new user
  if (user[0].customOption) {
    const formattedUserData = UserService.formatUserDataFromBill(customer_details);
    // save user data
    const savedUserResult = await UserService.storeUser(formattedUserData, tx);

    // map saved user with the company
    await UserCompanyService.storeUserCompanyMappingData([{ value: parseInt(selectedCompany) }], savedUserResult, tx);
    savedUser = [
      {
        label: savedUserResult.name,
        value: savedUserResult.id,
      },
    ];
  }

  return savedUser;
};

const checkIfNewItem = async (items: any, tx: any) => {
  const processedItem = items;
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const element = items[itemIndex];
    const itemData = element.item[0];

    if (!isInteger(itemData.value)) {
      if (itemData.value.includes('custom')) {
        const formattedItemData = ItemService.formatItemDataforStore(itemData);
        const item = await ItemService.storeItem(formattedItemData, tx);
        processedItem[itemIndex].item = [
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

  return processedItem;
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
    const { customer_details, items } = body;
    const reqQuery: any = req.query;
    const { selectedCompany } = reqQuery;

    const validationResult = await storeRequest.validateAsync(body);

    if (headers.authorization) {
      const loggingUser: any = getAuthUserFromHeaders(headers);
      customer_details.created_by = loggingUser.id;
      validationResult.created_by = loggingUser.id;
    }

    const result = await prisma.$transaction(async tx => {
      // if user is new then add it to the DB
      const savedUser = await checkIfNewUser(selectedCompany, body, tx);

      // check if there's new item added, if yes then save it in item database
      const newItemData = await checkIfNewItem(items, tx);
      validationResult.items = newItemData;

      // save data in bill
      const saveBill: any = await BillsService.storeBill(savedUser, validationResult, tx);

      // add debit entry for the user
      const debitTotalAmount = await UserService.updateAccountBalance(
        parseInt(savedUser[0].value),
        parseInt(selectedCompany),
        parseFloat(validationResult.total.total),
        tx,
      );

      return { savedUser, saveBill, debitTotalAmount };
    });

    return res.json(successResponse({ result }));
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
    const { items } = body;
    const reqQuery: any = req.query;
    const { selectedCompany } = reqQuery;

    if (!selectedCompany) throw new createHttpError.UnprocessableEntity('Company Id not mentioned');
    const validateData = await updateRequest.validateAsync(body);
    if (headers.authorization) {
      const loggingUser: any = getAuthUserFromHeaders(headers);
      body.customer_details.created_by = loggingUser.id;
      validateData.created_by = loggingUser.id;
    }

    const result = await prisma.$transaction(async tx => {
      // if user is new then add it to the DB
      const savedUser = await checkIfNewUser(selectedCompany, body, tx);

      // check if there's new item added, if yes then save it in item database
      const newItemData = await checkIfNewItem(items, tx);

      validateData.items = newItemData;
      const updateBill = await BillsService.updateBill(params.id, savedUser, validateData, tx);

      // add debit entry for the user
      // fetch old Bill
      const billDataBeforeUpdate = await BillsService.findById(params.id);
      let totalAmountValue = 0;
      if (billDataBeforeUpdate) {
        const oldBillTotal = billDataBeforeUpdate.total;
        const currentBillTotal = validateData.total.total;
        // if amount is increased
        if (oldBillTotal < currentBillTotal) {
          totalAmountValue = (currentBillTotal - oldBillTotal) * -1;
        } else if (oldBillTotal > currentBillTotal) {
          // if amount is decreased
          totalAmountValue = oldBillTotal - currentBillTotal;
        }
      }

      const debitTotalAmount = await UserService.updateAccountBalance(
        parseInt(savedUser[0].value),
        parseInt(selectedCompany),
        totalAmountValue,
        tx,
      );

      return { updateBill, debitTotalAmount };
    });

    return res.json(successResponse(result));
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
