import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { successResponse } from '../../utils/helpers';
import { storeRequest, updateRequest } from '../FormValidators/UserFormValidator';
import AuthService from '../Services/AuthService';
import UserBankDetailsService from '../Services/UserBankDetailsService';
import UserCompanyService from '../Services/UserCompanyService';
import UserService from '../Services/UserService';

const index = async (req: Request, res: Response, next: any) => {
  try {
    const reqQuery: any = req.query;
    let data: any = [];
    if (reqQuery.autocomplete) {
      data = await UserService.fetchAllUsersForAutocomplete(reqQuery);
    } else {
      data = await UserService.fetchAllUsers(reqQuery);
    }

    return res.json(successResponse(data));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Get Details of the User of given id
 * @param req
 * @param res
 * @param next
 */
const show = async (req: Request, res: Response, next: any) => {
  try {
    const userData = await UserService.findById(req.params.id);

    return res.json(successResponse(userData));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Post api for Storing User in DB
 * @param req Request
 * @param res Response
 * @param next
 * @returns Response
 */
const store = async (req: Request, res: Response, next: any) => {
  try {
    const { headers, body } = req;

    const validationResult = await storeRequest.validateAsync(body);
    const { user_name } = validationResult; // ll provide sanitized data after validation

    const userData = await UserService.fetchUserByUserName(user_name);
    if (userData) throw new createHttpError.UnprocessableEntity('User with same login already been registered');

    validationResult.password = await AuthService.hashedPassword(validationResult.password);
    if (headers.authorization) {
      const loggingUser: any = AuthService.verifyAccessToken(headers.authorization);
      validationResult.created_by = loggingUser.userData.id;
    }

    // company Data
    const companyData = validationResult.companies;
    delete validationResult.companies;
    // save user data
    const savedUser = await UserService.storeUser(validationResult);
    let companyUserMapping: any = [];
    if (companyData && savedUser) {
      companyUserMapping = await UserCompanyService.storeUserCompanyMappingData(companyData, savedUser);
    }

    return res.json(successResponse({ savedUser, companyUserMapping }));
  } catch (error: any) {
    return next(new createHttpError.InternalServerError(error.message));
  }
};

const addUserBankDetails = async (userData: any, userBankDetailsData: any) => {
  if (userBankDetailsData.length > 0 && userData) {
    const userBankDetailsResult = await UserBankDetailsService.addUserBankDetails(userData, userBankDetailsData);

    return userBankDetailsResult;
  }
};
/**
 * Update the data of the id given
 * @param req
 * @param res
 * @param next
 */
const update = async (req: Request, res: Response, next: any) => {
  try {
    const { body, params } = req;
    const validateData = await updateRequest.validateAsync(body);
    const { user_name } = validateData; // ll provide sanitized data after validation

    const userData = await UserService.fetchUserByUserName(user_name, { selfUserId: parseInt(params.id) });
    if (userData) throw new createHttpError.UnprocessableEntity('User with same login already been registered');

    // company Data
    const companyData = validateData.companies;
    const userBankDetailsData = validateData.user_bank_details;
    delete validateData.companies;
    delete validateData.user_bank_details;

    const updateUser = await UserService.updateUser(params.id, validateData);
    let companyUserMapping: any = [];
    if (companyData && updateUser) {
      companyUserMapping = await UserCompanyService.storeUserCompanyMappingData(companyData, updateUser);
    }

    const bankDetailsResult = await addUserBankDetails(updateUser, userBankDetailsData);

    return res.json(successResponse({ updateUser, companyUserMapping, bankDetailsResult }));
  } catch (error: any) {
    next(error);
  }
};

/**
 * Delete User from DB
 *
 * @param req Request
 * @param res Response
 * @param next any
 * @returns Response
 */
const destroy = async (req: Request, res: Response, next: any): Promise<Response> => {
  try {
    const { id } = req.params;
    const { user }: any = req;
    const result = await UserService.deleteUser(id, user);

    return res.json(successResponse({ result }));
  } catch (error: any) {
    return next(new createHttpError.InternalServerError(error.message));
  }
};
export default {
  index,
  show,
  store,
  update,
  destroy,
};
