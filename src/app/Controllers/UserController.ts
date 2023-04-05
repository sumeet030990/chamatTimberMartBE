import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { successResponse } from '../../utils/helpers';
import { storeRequest, updateRequest } from '../FormValidators/UserFormValidator';
import UserService from '../Services/UserService';

const index = async (req: Request, res: Response, next: any) => {
  try {
    const reqQuery: any = req.query;
    const data = await UserService.fetchAllUsers(reqQuery);

    return res.json(successResponse(data));
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
    const validationResult = await storeRequest.validateAsync(req.body);
    const { user_name } = validationResult; // ll provide sanitized data after validation

    const userData = await UserService.fetchUserByUserName(user_name);
    if (userData) throw new createHttpError.UnprocessableEntity('User with same login already been registered');

    // save user data
    const savedUser = await UserService.storeUser(validationResult);

    return res.json(successResponse({ savedUser }));
  } catch (error: any) {
    return next(new createHttpError.InternalServerError(error.message));
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

    const userData = await UserService.fetchUserByUserName(user_name, params.id);
    if (userData) throw new createHttpError.UnprocessableEntity('User with same login already been registered');

    const updateUser = await UserService.updateUser(params.id, validateData);

    return res.json(successResponse(updateUser));
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
  store,
  update,
  destroy,
};
