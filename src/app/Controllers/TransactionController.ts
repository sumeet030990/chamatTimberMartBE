import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { isNull } from 'lodash';
import { convertDateToISOString, getCurrentDate } from '../../utils/dateTimeConversions';
import { successResponse } from '../../utils/helpers';
import { storeRequest } from '../FormValidators/TransactionFormValidator';
import AccountStatementService from '../Services/AccountStatementService';
import AuthService from '../Services/AuthService';
import TransactionService from '../Services/TransactionService';
import UserBalanceService from '../Services/UserBalanceService';
import UserCompanyService from '../Services/UserCompanyService';
import UserService from '../Services/UserService';

const prisma = new PrismaClient();

const index = async (req: Request, res: Response, next: any) => {
  try {
    const reqQuery: any = req.query;
    const result = await TransactionService.fetchAllTransactions(reqQuery);

    return res.json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};

/**
 * Check if there's a new user created by user
 * @param body
 * @returns
 */
const checkIfNewUser = async (selectedCompany: string, body: any, tx: any) => {
  const { custom_user_obj } = body;

  // if custiomOption is true then it means that there's a new user
  const formattedUserData = UserService.formatUserDataFromBill({
    user: [{ label: custom_user_obj[0].label }],
    contact_detail: body.contact_details || '',
    city: body.city || '',
    created_by: parseInt(body.created_by),
  });

  // save user data
  const savedUserResult = await UserService.storeUser(formattedUserData, tx);

  // map saved user with the company
  await UserCompanyService.storeUserCompanyMappingData([{ value: parseInt(selectedCompany) }], savedUserResult, tx);
  const savedUser = [
    {
      label: savedUserResult.name,
      value: savedUserResult.id,
    },
  ];

  return savedUser;
};

const store = async (req: Request, res: Response, next: any) => {
  try {
    const { headers } = req;
    const validationResult = await storeRequest.validateAsync(req.body);

    const result = await prisma.$transaction(async tx => {
      if (headers.authorization) {
        const loggingUser: any = AuthService.verifyAccessToken(headers.authorization);
        validationResult.created_by = loggingUser.userData.id;
      }
      if (isNull(validationResult.user_id)) {
        // Step1: if user is new then add it to the DB
        const userData = await checkIfNewUser(validationResult.company_id, validationResult, tx);
        validationResult.user_id = userData[0].value;
      }
      // delete excess property which are used for user creation
      delete validationResult.custom_user_obj;
      delete validationResult.city;
      delete validationResult.contact_details;

      // get user balance Detail
      const userBalanceDetail = await UserBalanceService.getUserBalanceDataByUserId(
        validationResult.user_id,
        validationResult.company_id,
        tx,
      );

      validationResult.deleted_at = null;
      validationResult.deleted_by = null;
      // save transaction data
      const transactionResult = await TransactionService.storeTransaction(validationResult, userBalanceDetail, tx);

      // add details in account statement
      const accountStatementBody = {
        created_for: parseInt(validationResult.user_id),
        company_id: parseInt(validationResult.company_id),
        transaction_id: parseInt(transactionResult.transactionResult.id),
        statement: `Transaction Id: #${transactionResult.transactionResult.id}`,
        amount: parseFloat(transactionResult.transactionResult.amount),
        transaction_type: validationResult.type,
        created_at: convertDateToISOString(getCurrentDate()),
        created_by_user: validationResult.created_by,
      };

      const accountStatement = await AccountStatementService.store(accountStatementBody, tx);

      return { transactionResult, accountStatement };
    });

    return res.json(successResponse({ result }));
  } catch (error: any) {
    return next(new createHttpError.InternalServerError(error.message));
  }
};

const destroy = async (req: Request, res: Response, next: any) => {
  let loggingUser: any = null;
  try {
    const { headers, params } = req;
    if (headers.authorization) {
      loggingUser = AuthService.verifyAccessToken(headers.authorization);
    }

    const userBalanceDetail = await TransactionService.fetchTransactionById(params.id);

    // update delete_at && deleted_by in transaction and upate user_balance amount
    const deleteTransaction = await TransactionService.deleteTransaction(userBalanceDetail, loggingUser);

    await AccountStatementService.deleteByTransactionId(parseInt(params.id));

    return res.json(successResponse(deleteTransaction));
  } catch (error: any) {
    return next(new createHttpError.InternalServerError(error.message));
  }
};

export default {
  index,
  store,
  destroy,
};
