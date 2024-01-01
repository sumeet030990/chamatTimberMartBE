import AccountStatementRepository from '../Repositories/AccountStatementRepository';

/**
 * Fetch all Bill Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllAccountStatements = (reqQuery: any) => {
  return AccountStatementRepository.fetchAllAccountStatements(reqQuery);
};

/**
 * Store Account Statement
 * @param body
 * @param prismaTx
 *
 * @returns Collection
 */
const store = (body: any, prismaTx: any) => {
  return AccountStatementRepository.store(body, prismaTx);
};

const updateByBillId = (billId: number, accountStatementBody: any, tx: any) => {
  return AccountStatementRepository.updateByBillId(billId, accountStatementBody, tx);
};

const deleteByTransactionId = (transactionId: number) => {
  return AccountStatementRepository.deleteByTransactionId(transactionId);
};

export default {
  fetchAllAccountStatements,
  store,
  updateByBillId,
  deleteByTransactionId,
};
