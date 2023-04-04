import UserRepository from '../Repositories/UserRepository';

/**
 * Fetch all User Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllUsers = reqQuery => {
  return UserRepository.fetchAllUsers(reqQuery);
};

export default {
  fetchAllUsers,
};
