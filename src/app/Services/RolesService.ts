import RolesRepository from '../Repositories/RolesRepository';

/**
 * Fetch all Role Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllRoles = () => {
  return RolesRepository.fetchAllRoles();
};

export default {
  fetchAllRoles,
};
