import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { isNull } from 'lodash';
import { CREDIT, DEBIT } from '../../utils/constant';
import { convertDateToISOString } from '../../utils/dateTimeConversions';
import { parseNumberToAmountString } from '../../utils/helpers';

const prisma = new PrismaClient();

/**
 * Fetch All Account Statements
 * @param queryParams
 * @returns
 */
const fetchAllAccountStatements = async (queryParams: any) => {
  try {
    const {
      pageNumber,
      pageSize,
      sort_field,
      sort_order,
      selectedCompany,
      user,
      startDate,
      endDate,
      onlyTransactions,
    } = queryParams;

    let sortField: any = {
      [sort_field]: sort_order,
    };
    if (sort_field === 'createdByUser.name') {
      sortField = {
        createdByUser: {
          name: sort_order,
        },
      };
    }
    if (sort_field === 'created_for_user.name') {
      sortField = {
        created_for_user: {
          name: sort_order,
        },
      };
    }
    if (sort_field === 'transaction.payment_mode') {
      sortField = {
        transaction: {
          payment_mode: sort_order,
        },
      };
    }

    let createdAtFilter = {};
    if (startDate !== '' && endDate !== '') {
      const startDateConverted = convertDateToISOString(startDate);
      const endDateConverted = convertDateToISOString(endDate, true);

      createdAtFilter = {
        created_at: {
          gte: startDateConverted,
          lte: endDateConverted,
        },
      };
    }
    let createdForFilter = {};
    if (user) {
      createdForFilter = {
        created_for: parseInt(user),
      };
    }

    let pageSizeCondition: any = {
      skip: Number((pageNumber - 1) * pageSize),
      take: Number(pageSize),
    };
    if (pageSize === 'all') {
      pageSizeCondition = {};
    }

    let fetchOnlyTransactionsRecordFilter = {};

    if (onlyTransactions === 'true') {
      fetchOnlyTransactionsRecordFilter = {
        transaction_id: {
          not: null,
        },
      };
    }

    const result = await prisma.account_statement.findMany({
      where: {
        company_id: parseInt(selectedCompany),
        ...createdAtFilter,
        ...createdForFilter,
        ...fetchOnlyTransactionsRecordFilter,
      },
      select: {
        created_for_user: {
          select: {
            name: true,
          },
        },
        statement: true,
        transaction_type: true,
        amount: true,
        created_at: true,
        createdByUser: {
          select: {
            name: true,
          },
        },
        transaction: {
          select: {
            payment_mode: true,
            note: true,
          },
        },
      },
      orderBy: {
        ...sortField,
      },
      ...pageSizeCondition,
    });

    const count = await prisma.account_statement.count({
      where: {
        company_id: parseInt(selectedCompany),
        ...createdAtFilter,
        ...createdForFilter,
        ...fetchOnlyTransactionsRecordFilter,
      },
    });

    const creditCashObj = await prisma.account_statement.aggregate({
      where: {
        company_id: parseInt(selectedCompany),
        ...createdAtFilter,
        ...createdForFilter,
        ...fetchOnlyTransactionsRecordFilter,
        transaction_type: CREDIT,
      },
      _sum: {
        amount: true,
      },
    });

    const debitCashObj = await prisma.account_statement.aggregate({
      where: {
        company_id: parseInt(selectedCompany),
        ...createdAtFilter,
        ...createdForFilter,
        ...fetchOnlyTransactionsRecordFilter,
        transaction_type: DEBIT,
      },
      _sum: {
        amount: true,
      },
    });
    const creditCashAmount = isNull(creditCashObj._sum.amount) ? 0 : creditCashObj._sum.amount;
    const debitCashAmount = isNull(debitCashObj._sum.amount) ? 0 : debitCashObj._sum.amount;

    return {
      page: pageNumber,
      size: pageSize !== 'all' ? pageSize : count,
      total_records: count,
      total_page: pageSize !== 'all' ? Math.ceil(count / pageSize) : 1,
      data: result,
      creditCashAmount: parseNumberToAmountString(creditCashAmount),
      debitCashAmount: parseNumberToAmountString(debitCashAmount),
      totalCash: parseNumberToAmountString(debitCashAmount - creditCashAmount),
    };
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Store Account Statement
 * @param body
 * @param prismaTx
 *
 * @returns Collection
 */
const store = async (body: any, prismaTx: any = {}) => {
  try {
    const result = await prismaTx.account_statement.create({
      data: body,
    });

    return {
      data: result,
    };
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

const updateByBillId = async (billId: number, accountStatementBody: any, tx: any) => {
  const result = await tx.account_statement.updateMany({
    where: {
      bill_id: billId,
    },
    data: accountStatementBody,
  });

  return result;
};

const deleteByTransactionId = (transactionId: number) => {
  const result = prisma.account_statement.deleteMany({
    where: {
      transaction_id: transactionId,
    },
  });

  return result;
};

export default {
  fetchAllAccountStatements,
  store,
  updateByBillId,
  deleteByTransactionId,
};
