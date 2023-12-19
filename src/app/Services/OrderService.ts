import { Prisma, PrismaClient } from '@prisma/client';
import OrderDetailService from './OrderDetailService';
import { fetchQueryParamsType } from '../../types/commons';
import { convertDateStringToDate, getCurrentDate } from '../../utils/dateTimeConversions';
import OrderDetailRepository from '../Repositories/OrderDetailRepository';
import OrderRepository from '../Repositories/OrderRepository';

const prisma = new PrismaClient();

/**
 * Fetch all Order Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllOrders = (reqQuery: fetchQueryParamsType) => {
  return OrderRepository.fetchAllOrders(reqQuery);
};

/**
 * fetch Order by id
 * @returns
 */
const findById = (id: string) => {
  return OrderRepository.findById(id);
};

/**
 * Format Data for Order
 * @param savedUser
 * @param orderData
 * @returns
 */
const formatOrderData = (savedUser: any, orderData: any) => {
  const { customer_details } = orderData;

  return {
    user_id: savedUser.value,
    user_object: savedUser,
    city: orderData.customer_details.city,
    contact_number: customer_details.contact_detail,
    item_type: customer_details.item_type,
    invoice_date: convertDateStringToDate(customer_details.invoice_date),
    total: parseFloat(orderData.total.total),
    total_typewise: orderData.total,
    bill_type: orderData.type,
    created_at: getCurrentDate(),
    created_by_user: savedUser.value,
  };
};

/**
 * Store Order in DB
 * @param data
 * @returns
 */
const storeOrder = async (savedUser: any, orderData: Prisma.ordersCreateInput) => {
  const formattedOrderData = formatOrderData(savedUser, orderData);

  const result = await prisma.$transaction(async tx => {
    // 1. Store ORDER data.
    const orderResult = await OrderRepository.storeOrder(tx, formattedOrderData);

    // 2. Verify that the sender's balance didn't go below zero.
    const formattedOrderDetailsData = OrderDetailService.formatOrderDetailData(orderResult, orderData);
    const orderDetailsResult = [];
    for (let index = 0; index < formattedOrderDetailsData.length; index++) {
      const element = formattedOrderDetailsData[index];
      const orderDetailsElementResult = await OrderDetailRepository.storeOrderDetails(tx, element);
      orderDetailsResult.push(orderDetailsElementResult);
    }

    return { orderResult, orderDetailsResult };
  });

  // const result = await OrderRepository.storeOrder(formattedOrderData, formattedOrderDetailsData);

  return result;
};

/**
 * Update Order Data in DB
 * @param data
 * @returns
 */
const updateOrder = async (id: string, data: object) => {
  return OrderRepository.updateOrder(id, data);
};

/**
 * Delete Order in DB
 * @param userId string
 * @returns
 */
const deleteOrder = (userId: string) => {
  return OrderRepository.deleteOrder(userId);
};

export default {
  fetchAllOrders,
  findById,
  storeOrder,
  updateOrder,
  deleteOrder,
};
