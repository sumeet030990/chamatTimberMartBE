import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { fetchQueryParamsType } from '../../types/commons';

const prisma = new PrismaClient();

/**
 * Fetch All Orders
 * @param queryParams
 * @returns
 */
const fetchAllOrders = async (queryParams: fetchQueryParamsType) => {
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

    const result = await prisma.orders.findMany({
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

    const count = await prisma.orders.count({});

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
 * Fetch All Orders Data from dropdown
 * @param queryParams
 * @returns
 */
const fetchAllOrdersDataForDropdown = async () => {
  try {
    const result = await prisma.orders.findMany({
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
    const result = await prisma.orders.findFirst({
      where: {
        id: Number(id),
      },
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Store Order in DB
 * @param userData
 * @returns
 */
const storeOrder = async (tx: any, orderData: any) => {
  try {
    const savedOrder = await tx.orders.create({
      data: {
        ...orderData,
      },
    });

    return savedOrder;

    // return {
    //   data: {
    //     ...orderData,
    //     order_details: {
    //       create: { ...orderDetailData },
    //     },
    //   },
    // };
    // const savedOrder = await prisma.orders.create({
    //   data: {
    //     user_id: 3,
    //     user_object: {
    //       value: 3,
    //       label: 'Customer 1',
    //     },
    //     city: 'Nagpur',
    //     contact_number: '0123456789',
    //     item_type: 'all',
    //     invoice_date: '2023-11-21T18:30:00.000Z',
    //     total: 1312.5,
    //     total_typewise: {
    //       total: 1312.5,
    //       teak_sawn: 312.5,
    //       bidding: 0,
    //       mandir: 1000,
    //       furniture: 0,
    //     },
    //     bill_type: 'whole_sale_bill',
    //     created_at: '2023-12-04T13:37:55.604Z',
    //     created_by_user: 1,
    //     deleted_by_user: 1,
    //     order_details: {
    //       create: [
    //         {
    //           item_id: 1,
    //           item_object: {
    //             value: 1,
    //             label: '1.50*0.50',
    //             type: 'teak_sawn',
    //             length: 1.5,
    //             width: 0.5,
    //             height: null,
    //           },
    //           size: null,
    //           piece: 2,
    //           rate: 100,
    //           remark: null,
    //           sub_items: [],
    //         },
    //         {
    //           item_id: 4,
    //           item_object: {
    //             value: 4,
    //             label: 'Mandir',
    //             type: 'mandir',
    //             length: null,
    //             width: null,
    //             height: null,
    //           },
    //           size: 10,
    //           piece: 10,
    //           rate: 10,
    //           remark: null,
    //           sub_items: [],
    //         },
    //       ],
    //     },
    //   },
    // });

    // return savedOrder;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Update Order in Db
 * @param id string
 * @param data object
 * @returns
 */
const updateOrder = async (id: string, data: any) => {
  try {
    const [result] = await prisma.$transaction([
      prisma.orders.update({
        where: {
          id: Number(id),
        },
        data,
      }),
    ]);

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Delete Order in DB
 *
 * @param companyId string
 * @param loggedInUser string
 * @returns
 */
const deleteOrder = async (companyId: string) => {
  try {
    const deleteResult = await prisma.orders.delete({
      where: {
        id: Number(companyId),
      },
    });

    return deleteResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};
export default {
  fetchAllOrders,
  fetchAllOrdersDataForDropdown,
  findById,
  storeOrder,
  updateOrder,
  deleteOrder,
};
