import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { fetchQueryParamsType } from '../../types/commons';

const prisma = new PrismaClient();

/**
 * Fetch All Bills
 * @param queryParams
 * @returns
 */
const fetchAllBills = async (queryParams: fetchQueryParamsType) => {
  try {
    const { pageNumber, pageSize, sort_field, sort_order } = queryParams;
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
    if (sort_field === 'users.name') {
      sortField = {
        users: {
          name: sort_order,
        },
      };
    }

    const result = await prisma.bills.findMany({
      select: {
        id: true,
        users: {
          select: {
            name: true,
          },
        },
        bill_type: true,
        invoice_date: true,
        total: true,
        createdByUser: {
          select: {
            name: true,
          },
        },
      },
      skip: Number((pageNumber - 1) * pageSize),
      take: Number(pageSize),
      orderBy: {
        ...sortField,
      },
    });

    const count = await prisma.bills.count({});

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
 * Fetch All Bills Data from dropdown
 * @param queryParams
 * @returns
 */
const fetchAllBillsDataForDropdown = async () => {
  try {
    const result = await prisma.bills.findMany({
      select: {
        id: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Fetch Data By id
 * @param id
 * @returns User
 */
const findById = async (id: string) => {
  try {
    const result = await prisma.bills.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        transactions: true,
      },
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Store Bill in DB
 * @param userData
 * @returns
 */
const storeBill = async (tx: any, billData: any) => {
  try {
    const savedBill = await tx.bills.create({
      data: {
        ...billData,
      },
    });

    return savedBill;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Update Bill in Db
 * @param id string
 * @param data object
 * @returns
 */
const updateBill = async (tx: any, id: string, data: any) => {
  try {
    const result = await tx.bills.update({
      where: {
        id: Number(id),
      },
      data,
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Delete Bill in DB
 *
 * @param companyId string
 * @param loggedInUser string
 * @returns
 */
const deleteBill = async (companyId: string) => {
  try {
    const deleteResult = await prisma.bills.delete({
      where: {
        id: Number(companyId),
      },
    });

    return deleteResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Update Bill in DB
 *
 * @param companyId string
 * @param loggedInUser string
 * @returns
 */
const updateTransactionIdInBill = async (transactionId: number, billId: number, prismaTx: any) => {
  try {
    const updateResult = await prismaTx.bills.update({
      where: {
        id: billId,
      },
      data: {
        transaction_id: transactionId,
      },
    });

    return updateResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

export default {
  fetchAllBills,
  fetchAllBillsDataForDropdown,
  findById,
  storeBill,
  updateBill,
  deleteBill,
  updateTransactionIdInBill,
};
