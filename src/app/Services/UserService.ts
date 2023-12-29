/* eslint-disable no-param-reassign */
import { isUndefined } from 'lodash';
import { fetchQueryParamsType } from '../../types/commons';
import { fetchUserByUserNameFilterParams, fetchUserQueryParamsType } from '../../types/userTypes';
import { formatDataForDropdown } from '../../utils/helpers';
import UserRepository from '../Repositories/UserRepository';

const getSortingCondition = (reqQuery: fetchQueryParamsType) => {
  const { sort_field, sort_order } = reqQuery;

  if (sort_field === 'role') {
    reqQuery.sortCondition = {
      user_role: {
        name: sort_order,
      },
    };
  } else if (sort_field === 'balance') {
    reqQuery.sortCondition = {
      user_balance: {
        amount: sort_order,
      },
    };
  } else if (sort_field === 'allowLogin') {
    reqQuery.sortCondition = {
      allow_login: sort_order,
    };
  } else {
    reqQuery.sortCondition = {
      [sort_field]: sort_order,
    };
  }

  return reqQuery;
};

const getSearchCondtion = (reqQuery: fetchQueryParamsType) => {
  const { search } = reqQuery;

  if (isUndefined(search)) {
    reqQuery.search = {};

    return reqQuery;
  }

  reqQuery.search = {
    OR: [
      {
        name: {
          contains: search,
        },
      },
      {
        user_role: {
          is: {
            name: {
              contains: search,
            },
          },
        },
      },
    ],
  };

  return reqQuery;
};
/**
 * Fetch all User Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllUsers = (reqQuery: fetchQueryParamsType) => {
  reqQuery = getSortingCondition(reqQuery);

  // search
  reqQuery = getSearchCondtion(reqQuery);

  return UserRepository.fetchAllUsers(reqQuery);
};

/**
 * Fetch all User Data for Autocomplete
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllUsersForAutocomplete = async (reqQuery: fetchUserQueryParamsType) => {
  const result = await UserRepository.fetchAllUsersForAutocomplete(reqQuery);
  const formattedData = formatDataForDropdown(result);

  return formattedData;
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
// const storeUser = async (data: Prisma.usersCreateInput) => {
const storeUser = async (data: any, prismaTx: any = {}) => {
  return UserRepository.storeUser(data, prismaTx);
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

/**
 * From BillController when user is new we need to save this user to db
 * so formatting the incoming data as per requirement
 * @param userData
 * @returns
 */
const formatUserDataFromBill = (userData: any) => {
  return {
    allow_login: false,
    name: userData?.user[0].label,
    primary_contact: userData.contact_detail || '',
    city_name: userData.city || '',
    role_id: 2,
    language_id: 1,
    created_by: parseInt(userData.created_by),
  };
};

export default {
  fetchAllUsers,
  fetchAllUsersForAutocomplete,
  fetchUserByUserName,
  findById,
  storeUser,
  formatUserDataFromBill,
  updateUser,
  deleteUser,
};
