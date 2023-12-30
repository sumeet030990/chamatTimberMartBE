import { Prisma } from '@prisma/client';
import { fetchQueryParamsType } from '../../types/commons';
import TransactionRepository from '../Repositories/TransactionRepository';

/**
 * Store Transaction Data
 * @param data
 *
 * @returns
 */
const fetchAllTransactions = (reqQuery: fetchQueryParamsType) => {
  return TransactionRepository.fetchAllTransactions(reqQuery);
};

/**
 * get User Balance Data by Transaction Id
 * @param data
 *
 * @returns
 */
const fetchTransactionById = (transactionId: string) => {
  return TransactionRepository.fetchTransactionById(transactionId);
};

/**
 * Store Transaction Data
 * @param data
 *
 * @returns
 */
const storeTransaction = (data: Prisma.transactionCreateInput, userBalanceDetail: any, tx: any) => {
  return TransactionRepository.storeTransaction(data, userBalanceDetail, tx);
};

/**
 * Delete Transaction Data
 * @param data
 *
 * @returns
 */
const deleteTransaction = (data: any, loggingUser: any) => {
  return TransactionRepository.deleteTransaction(data, loggingUser);
};

export default {
  fetchAllTransactions,
  fetchTransactionById,
  storeTransaction,
  deleteTransaction,
};
