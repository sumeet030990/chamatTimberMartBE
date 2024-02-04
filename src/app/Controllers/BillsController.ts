import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { isInteger } from 'lodash';
import { CREDIT, DEBIT } from '../../utils/constant';
import { getCurrentDate } from '../../utils/dateTimeConversions';
import { getAuthUserFromHeaders, successResponse } from '../../utils/helpers';
import { storeRequest, updateRequest } from '../FormValidators/BillFormValidator';
import AccountStatementService from '../Services/AccountStatementService';
import BillsService from '../Services/BillsService';
import ItemService from '../Services/ItemService';
import TransactionService from '../Services/TransactionService';
import UserBalanceService from '../Services/UserBalanceService';
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
      // Step1: if user is new then add it to the DB
      const savedUser = await checkIfNewUser(selectedCompany, body, tx);

      // Step2:  check if there's new item added, if yes then save it in item database
      const newItemData = await checkIfNewItem(items, tx);
      validationResult.items = newItemData;

      // Step3: save data in bill
      const saveBill: any = await BillsService.storeBill(savedUser, validationResult, tx);

      // Step 4: add debit entry for the user
      const debitTotalAmount = await UserService.updateAccountBalance(
        parseInt(savedUser[0].value),
        parseInt(selectedCompany),
        parseFloat(validationResult.total.total),
        tx,
      );

      // Step 5: add details in account statement
      const accountStatementBodyForBill = {
        created_for: parseInt(savedUser[0].value),
        company_id: parseInt(selectedCompany),
        bill_id: parseInt(saveBill.billResult.id),
        statement: `Invoice created: #${saveBill.billResult.id}`,
        amount: parseFloat(validationResult.total.total),
        transaction_type: CREDIT,
        created_by_user: validationResult.created_by,
      };

      const accountStatement = await AccountStatementService.store(accountStatementBodyForBill, tx);

      // Step 6: add transaction in account statement
      if (parseFloat(validationResult.amount_paid) === 0) {
        return { savedUser, saveBill, debitTotalAmount, accountStatement };
      }

      const transactionBody = {
        user_id: savedUser[0].value,
        amount: parseFloat(validationResult.amount_paid),
        type: DEBIT,
        date: getCurrentDate(),
        payment_mode: validationResult.payment_mode,
        company_id: parseInt(selectedCompany),
        note: `${validationResult.payment_mode.toUpperCase()} payment against invoice #${saveBill.billResult.id}`,
        created_by: validationResult.created_by,
      };

      const userBalanceDetail = await UserBalanceService.getUserBalanceDataByUserId(
        validationResult.user_id,
        validationResult.company_id,
        tx,
      );

      const transactionResult = await TransactionService.storeTransaction(transactionBody, userBalanceDetail, tx);

      // Step 7: add payment details in account statement
      const accountStatementBodyForTransaction = {
        created_for: parseInt(savedUser[0].value),
        company_id: parseInt(selectedCompany),
        transaction_id: parseInt(transactionResult.transactionResult.id),
        statement: `${validationResult.payment_mode.toUpperCase()} payment against invoice: #${saveBill.billResult.id}`,
        amount: parseFloat(validationResult.amount_paid),
        transaction_type: DEBIT,
        created_by_user: validationResult.created_by,
      };

      const accountStatementForTransaction = await AccountStatementService.store(
        accountStatementBodyForTransaction,
        tx,
      );

      // step 8: update transaction id in bill
      await BillsService.updateTransactionIdInBill(
        parseInt(transactionResult.transactionResult.id),
        parseInt(saveBill.billResult.id),
        tx,
      );

      return {
        savedUser,
        saveBill,
        debitTotalAmount,
        accountStatement,
        transactionResult,
        accountStatementForTransaction,
      };
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

      // update details in account statement
      const accountStatementBody = {
        created_for: parseInt(savedUser[0].value),
        statement: `Invoice created: #${updateBill.billResult.id}`,
        amount: parseFloat(validateData.total.total),
      };

      const accountStatement = await AccountStatementService.updateByBillId(
        parseInt(updateBill.billResult.id),
        accountStatementBody,
        tx,
      );

      return { updateBill, debitTotalAmount, accountStatement };
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
