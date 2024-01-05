import { isEmpty, omit } from 'lodash';
import { PAGE_SIZE } from './constant';
import AuthService from '../app/Services/AuthService';

/**
 * @desc    Send any success response
 *
 * @param   {any} body
 * @param   {number} statusCode
 */
const successResponse = (body: any, statusCode: number = 200) => ({
  error: false,
  code: statusCode,
  body,
});

/**
 * @desc    Send any error response
 *
 * @param   {any} body
 * @param   {number} statusCode
 */
const errorResponse = (body: any, statusCode: number = 500) => ({
  error: true,
  code: statusCode,
  body,
});

/**
 * Create query string for sorting and filtering for index page data table data
 * @param queryString
 * @returns
 */
const getIndexPageQueryParams = (queryString: any) => {
  const { pageNumber, pageSize, sort_field, sort_order } = queryString;

  const pageNumberData = isEmpty(pageNumber) ? 1 : pageNumber;
  const pageSizeData = isEmpty(pageSize) ? PAGE_SIZE : pageSize;

  let orderByParams = {};
  if (sort_field.includes('.')) {
    if (!isEmpty(sort_field)) {
      const query = sort_field?.toString().split('.');
      if (query) {
        const key1 = query[0];
        const key2 = query[1];

        orderByParams = {
          [key1]: {
            [key2]: sort_order,
          },
        };
      }
    }
  } else {
    orderByParams = {
      [sort_field]: sort_order,
    };
  }

  return {
    pageNumber: pageNumberData,
    pageOffset: Number((pageNumber - 1) * pageSize),
    pageSize: pageSizeData,
    filterParams: {},
    orderByParams,
  };
};

/**
 * reset query string for sorting and filtering for index page data table data
 * @param queryString
 * @returns
 */
const resetPagination = (queryString: any) => {
  const { pageSize } = queryString;

  const pageNumberData = 1;
  const pageSizeData = isEmpty(pageSize) ? PAGE_SIZE : pageSize;

  return {
    ...queryString,
    pageNumber: pageNumberData,
    pageOffset: Number((pageNumberData - 1) * pageSize),
    pageSize: pageSizeData,
  };
};

/**
 * In models we have created an array named protected
 * with this method we can remove those filds from the object
 * @param data
 * @param protectedFields
 * @returns
 */
const removeProtectedFieldsFromData = (data: any, protectedFields: string[]) => {
  return omit({ ...data }, protectedFields); // remove protected fields from user data
};

const formatDataForDropdown = (collectionData: any, idField = 'id', valueField = 'name') => {
  return collectionData.map((data: any) => {
    return {
      value: data[idField],
      label: data[valueField],
    };
  });
};

const getAuthUserFromHeaders = (headers: any) => {
  const authUser: any = AuthService.verifyAccessToken(headers.authorization);

  return authUser.userData;
};

/**
 * Convert snake_case words to Title Case
 * @param string
 * @returns
 */
const convertSnakeCaseToTitleCase = (s: String) => {
  return s
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
    .replace(/[-_]+(.)/g, (_, c) => ` ${c.toUpperCase()}`); // First char after each -/_
};

const parseNumberToAmountString = (amount: number | string) => {
  if (amount === 0) {
    return '0';
  }
  if (typeof amount === 'number') {
    return amount.toFixed(2);
  }

  return parseFloat(amount).toFixed(2);
};
export {
  successResponse,
  errorResponse,
  getIndexPageQueryParams,
  resetPagination,
  removeProtectedFieldsFromData,
  formatDataForDropdown,
  getAuthUserFromHeaders,
  convertSnakeCaseToTitleCase,
  parseNumberToAmountString,
};
