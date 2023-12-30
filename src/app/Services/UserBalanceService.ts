import UserBalanceRepository from '../Repositories/UserBalanceRepository';

/**
 * get User Balance Data
 * @param data
 *
 * @returns
 */
const getUserBalanceDataByUserId = (userId: number, companyId: number, tx: any) => {
  return UserBalanceRepository.getUserBalanceDataByUserId(userId, companyId, tx);
};

export default {
  getUserBalanceDataByUserId,
};
