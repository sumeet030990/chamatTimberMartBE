import { Prisma, PrismaClient } from '@prisma/client';
import BillDetailService from './BillDetailService';
import { fetchQueryParamsType } from '../../types/commons';
import { convertDateStringToDate, getCurrentDate } from '../../utils/dateTimeConversions';
import BillsDetailRepository from '../Repositories/BillsDetailRepository';
import BillsRepository from '../Repositories/BillsRepository';

const prisma = new PrismaClient();

/**
 * Fetch all Bill Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllBills = (reqQuery: fetchQueryParamsType) => {
  return BillsRepository.fetchAllBills(reqQuery);
};

/**
 * fetch Bill by id
 * @returns
 */
const findById = (id: string) => {
  return BillsRepository.findById(id);
};

/**
 * Format Data for Bill
 * @param savedUser
 * @param billData
 * @returns
 */
const formatBillData = (billData: any, savedUser: any) => {
  const { customer_details } = billData;

  return {
    user_id: savedUser[0].value,
    user_object: savedUser,
    city: billData.customer_details.city,
    contact_number: customer_details.contact_detail,
    item_type: customer_details.item_type,
    item_object: billData.items,
    invoice_date: convertDateStringToDate(customer_details.invoice_date),
    total: parseFloat(billData.total.total),
    total_typewise: billData.total,
    bill_type: billData.type,
    created_at: getCurrentDate(),
    created_by_user: billData.created_by,
  };
};

/**
 * Store Bill in DB
 * @param data
 * @returns
 */
const storeBill = async (savedUser: any, validationData: Prisma.billsCreateInput) => {
  const formattedBillData = formatBillData(validationData, savedUser);

  const result = await prisma.$transaction(async tx => {
    // 1. Store Bill data.
    const billResult = await BillsRepository.storeBill(tx, formattedBillData);

    // 2. Verify that the sender's balance didn't go below zero.
    const formattedBillDetailsData = BillDetailService.formatBillDetailData(billResult, validationData);
    const billDetailsResult = [];
    for (let index = 0; index < formattedBillDetailsData.length; index++) {
      const element = formattedBillDetailsData[index];
      const billDetailsElementResult = await BillsDetailRepository.storeBillDetails(tx, element);
      billDetailsResult.push(billDetailsElementResult);
    }

    return { billResult, billDetailsResult };
  });

  return result;
};

/**
 * Update Bill Data in DB
 * @param data
 * @returns
 */
const updateBill = async (id: string, savedUser: object, validationData: object) => {
  const formattedBillData = formatBillData(validationData, savedUser);
  console.log('formattedBillData: ', formattedBillData);

  const result = await prisma.$transaction(async tx => {
    // 1. Update Bill data.
    const billResult = await BillsRepository.updateBill(tx, id, formattedBillData);

    // 2. delete bill_details by bill id
    const deleteBillDetailsForUpdate = await BillsDetailRepository.deleteByBillId(tx, id);

    // 3. Verify that the sender's balance didn't go below zero.
    const formattedBillDetailsData = BillDetailService.formatBillDetailData(billResult, validationData);
    const billDetailsResult = [];
    for (let index = 0; index < formattedBillDetailsData.length; index++) {
      const element = formattedBillDetailsData[index];
      const billDetailsElementResult = await BillsDetailRepository.storeBillDetails(tx, element);
      billDetailsResult.push(billDetailsElementResult);
    }

    return { billResult, deleteBillDetailsForUpdate, billDetailsResult };
  });

  return result;
};

/**
 * Delete Bill in DB
 * @param userId string
 * @returns
 */
const deleteBill = (userId: string) => {
  return BillsRepository.deleteBill(userId);
};

export default {
  fetchAllBills,
  findById,
  storeBill,
  updateBill,
  deleteBill,
};
