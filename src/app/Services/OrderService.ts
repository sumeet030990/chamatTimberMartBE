import { Prisma } from '@prisma/client';
import OrderDetailService from './OrderDetailService';
import { fetchQueryParamsType } from '../../types/commons';
import { convertDateStringToDate, getCurrentDate } from '../../utils/dateTimeConversions';
import OrderRepository from '../Repositories/OrderRepository';

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
    total: orderData.total.total,
    total_typewise: orderData.total,
    bill_type: orderData.type,
    created_at: getCurrentDate(),
    created_by_user: orderData.created_by,
  };
};

/**
 * Store Order in DB
 * @param data
 * @returns
 */
const storeOrder = async (savedUser: any, orderData: Prisma.ordersCreateInput) => {
  const formattedOrderData = formatOrderData(savedUser, orderData);
  const formattedOrderDetailsData = OrderDetailService.formatOrderDetailData(orderData);
  const result = await OrderRepository.storeOrder(formattedOrderData, formattedOrderDetailsData);

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
