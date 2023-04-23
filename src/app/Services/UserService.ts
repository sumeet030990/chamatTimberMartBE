import { Prisma } from '@prisma/client';
import { fetchQueryParamsType } from '../../types/commons';
import { fetchUserByUserNameFilterParams } from '../../types/userTypes';
import UserRepository from '../Repositories/UserRepository';

/**
 * Fetch all User Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllUsers = (reqQuery: fetchQueryParamsType) => {
  return UserRepository.fetchAllUsers(reqQuery);
};

/**
 * Fetch User by Login
 * @param userName
 *
 * @returns Collection
 */
const fetchUserByUserName = async (userName: string, otherfilterParams: fetchUserByUserNameFilterParams = {}) => {
  const result: any = await UserRepository.fetchUserByUserName(userName, otherfilterParams);
  if (result?.users_company && result?.users_company?.length > 0) {
    const data = result.users_company.map((userCompany: any) => userCompany.company);
    result.users_company = data.map((company: any) => {
      return {
        value: company.id,
        label: company.name,
      };
    });
  }

  return result;
};

/**
 * fetch User by id
 * @returns
 */
const findById = async (id: string) => {
  const result: any = await UserRepository.findById(id);
  if (result.users_company && result.users_company.length > 0) {
    const data = result.users_company.map((userCompany: any) => userCompany.company);
    result.users_company = data.map((company: any) => {
      return {
        value: company.id,
        label: company.name,
      };
    });
  }

  return result;
};

/**
 * Store User in DB
 * @param data
 * @returns
 */
const storeUser = async (data: Prisma.usersCreateInput) => {
  return UserRepository.storeUser(data);
};

/**
 * Update User Data in DB
 * @param data
 * @returns
 */
const updateUser = async (id: string, data: object) => {
  return UserRepository.updateUser(id, data);
};

/**
 * Delete User in DB
 * @param userId string
 * @returns
 */
const deleteUser = (userId: string, loggedInUser: any = {}) => {
  return UserRepository.deleteUser(userId, loggedInUser);
};

export default {
  fetchAllUsers,
  fetchUserByUserName,
  findById,
  storeUser,
  updateUser,
  deleteUser,
};
