import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { successResponse } from '../../utils/helpers';
import { storeRequest } from '../FormValidators/TransactionFormValidator';
import AuthService from '../Services/AuthService';
import TransactionService from '../Services/TransactionService';
import UserBalanceService from '../Services/UserBalanceService';

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
const store = async (req: Request, res: Response, next: any) => {
  try {
    const { headers } = req;
    const validationResult = await storeRequest.validateAsync(req.body);

    const result = await prisma.$transaction(async tx => {
      // get user balance Detail
      const userBalanceDetail = await UserBalanceService.getUserBalanceDataByUserId(
        validationResult.user_id,
        validationResult.company_id,
        tx,
      );

      if (headers.authorization) {
        const loggingUser: any = AuthService.verifyAccessToken(headers.authorization);
        validationResult.created_by = loggingUser.userData.id;
      }

      validationResult.deleted_at = null;
      validationResult.deleted_by = null;
      // save transaction data
      const transactionResult = await TransactionService.storeTransaction(validationResult, userBalanceDetail, tx);

      return transactionResult;
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
