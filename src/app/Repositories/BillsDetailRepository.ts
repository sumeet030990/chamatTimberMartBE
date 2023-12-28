import createHttpError from 'http-errors';

/**
 * Store Bill in DB
 * @param userData
 * @returns
 */
const storeBillDetails = async (tx: any, billData: any) => {
  try {
    const savedBill = await tx.bill_details.create({
      data: {
        ...billData,
      },
    });

    return savedBill;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

export default {
  storeBillDetails,
};
