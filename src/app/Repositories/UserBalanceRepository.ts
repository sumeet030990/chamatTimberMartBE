import createHttpError from 'http-errors';

/**
 * Get User Balance Data
 * @param queryParams
 * @returns
 */
const getUserBalanceDataByUserId = async (userId: number, companyId: number, tx: any) => {
  try {
    let result = null;

    result = await tx.user_balance.findFirst({
      where: {
        user_id: userId,
        company_id: companyId,
      },
    });

    if (result === null) {
      result = await tx.user_balance.create({
        data: { user_id: userId, company_id: companyId, amount: 0 },
      });
    }

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

export default {
  getUserBalanceDataByUserId,
};
