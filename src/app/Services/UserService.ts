import { Prisma } from '@prisma/client';
import { fetchQueryParamsType } from '../../types/commons';
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
const fetchUserByUserName = (userName: string, selfUserId: string = '') => {
  return UserRepository.fetchUserByUserName(userName, selfUserId);
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
  storeUser,
  updateUser,
  deleteUser,
};
