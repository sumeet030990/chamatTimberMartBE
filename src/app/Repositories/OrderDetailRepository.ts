import createHttpError from 'http-errors';

/**
 * Store Order in DB
 * @param userData
 * @returns
 */
const storeOrderDetails = async (tx: any, orderData: any) => {
  console.log('orderData: ', orderData);
  try {
    const savedOrder = await tx.order_details.create({
      data: {
        ...orderData,
      },
    });

    return savedOrder;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

export default {
  storeOrderDetails,
};
