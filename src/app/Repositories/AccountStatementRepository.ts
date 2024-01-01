import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { addDateByDays, subtractDateByDays } from '../../utils/dateTimeConversions';

const prisma = new PrismaClient();

/**
 * Fetch All Account Statements
 * @param queryParams
 * @returns
 */
const fetchAllAccountStatements = async (queryParams: any) => {
  try {
    const { pageNumber, pageSize, sort_field, sort_order, selectedCompany, user, startDate, endDate } = queryParams;

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

    const lessStartDate = subtractDateByDays(startDate, 1);
    const greaterEndDate = addDateByDays(endDate, 1);

    let createdForFilter = {};
    if (user) {
      createdForFilter = {
        created_for: parseInt(user),
      };
    }
    const result = await prisma.account_statement.findMany({
      where: {
        company_id: parseInt(selectedCompany),
        created_at: {
          gt: lessStartDate,
          lt: greaterEndDate,
        },
        ...createdForFilter,
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
      skip: Number((pageNumber - 1) * pageSize),
      take: Number(pageSize),
      orderBy: {
        ...sortField,
      },
    });

    const count = await prisma.account_statement.count({});

    return {
      page: pageNumber,
      size: pageSize,
      total_records: count,
      total_page: Math.ceil(count / pageSize),
      data: result,
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
