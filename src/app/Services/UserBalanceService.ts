import UserBalanceRepository from '../Repositories/UserBalanceRepository';

/**
 * get User Balance Data
 * @param data
 *
 * @returns
 */
const getUserBalanceDataByUserId = (userId: number, companyId: number) => {
  return UserBalanceRepository.getUserBalanceDataByUserId(userId, companyId);
};

export default {
  getUserBalanceDataByUserId,
};
