import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { fetchQueryParamsType } from '../../types/commons';
import { getCurrentDate } from '../../utils/dateTimeConversions';

const prisma = new PrismaClient();

const fetchAllTransactions = async (queryParams: fetchQueryParamsType) => {
  try {
    const { pageNumber, pageSize, sort_field, sort_order, selectedCompany } = queryParams;
    const result = await prisma.transaction.findMany({
      where: {
        company: {
          id: parseInt(selectedCompany),
        },
        deleted_at: null,
      },
      include: {
        users: {
          select: {
            name: true,
          },
        },
        createdByUser: {
          select: {
            name: true,
          },
        },
      },
      skip: Number((pageNumber - 1) * pageSize),
      take: Number(pageSize),
      orderBy: {
        [sort_field]: sort_order,
      },
    });

    const count = await prisma.users.count({});

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
 * Get User Balance Data by Transaction Id
 * @param queryParams
 * @returns
 */
const fetchTransactionById = async (transactionId: string) => {
  try {
    const result = await prisma.transaction.findFirst({
      where: {
        id: parseInt(transactionId),
      },
      include: {
        users: {
          select: {
            user_balance: true,
          },
        },
      },
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};
/**
 * Store Transaction Data
 * @param queryParams
 * @returns
 */
const storeTransaction = async (data: any, userBalanceDetail: any, tx: any) => {
  try {
    const amount = data.type === 'cr' ? userBalanceDetail.amount - data.amount : userBalanceDetail.amount + data.amount;

    const transactionResult = await tx.transaction.create({
      data,
    });
    const userUpdateBalanceResult = await tx.user_balance.update({
      where: {
        id: userBalanceDetail.id,
      },
      data: {
        amount,
      },
    });

    return {
      data: { transactionResult, userUpdateBalanceResult },
    };
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Delete Transaction Data
 * @param queryParams
 * @returns
 */
const deleteTransaction = async (data: any, loggingUser: any) => {
  try {
    const userBalanceAmount = data.users.user_balance[0].amount;
    const amount = data.type === 'dr' ? userBalanceAmount - data.amount : userBalanceAmount + data.amount;

    const result = await prisma.$transaction([
      prisma.transaction.update({
        where: {
          id: data.id,
        },
        data: {
          deleted_at: getCurrentDate(),
          deleted_by: loggingUser.userData.id,
        },
      }),
      prisma.user_balance.update({
        where: {
          id: data.users.user_balance[0].id,
        },
        data: {
          amount,
        },
      }),
    ]);

    return {
      data: result,
    };
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

export default {
  fetchAllTransactions,
  fetchTransactionById,
  storeTransaction,
  deleteTransaction,
};
