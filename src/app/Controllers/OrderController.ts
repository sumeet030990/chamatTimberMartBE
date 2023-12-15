import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { getAuthUserFromHeaders, successResponse } from '../../utils/helpers';
import { storeRequest, updateRequest } from '../FormValidators/OrderFormValidator';
import OrderService from '../Services/OrderService';
import UserService from '../Services/UserService';

const index = async (req: Request, res: Response, next: any) => {
  try {
    const reqQuery: any = req.query;
    const data = await OrderService.fetchAllOrders(reqQuery);

    return res.json(successResponse(data));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Get Details of the Order of given id
 * @param req
 * @param res
 * @param next
 */
const show = async (req: Request, res: Response, next: any) => {
  try {
    const companyData = await OrderService.findById(req.params.id);

    return res.json(successResponse(companyData));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Post api for Storing Order in DB
 * @param req Request
 * @param res Response
 * @param next
 * @returns Response
 */
const store = async (req: Request, res: Response, next: any) => {
  try {
    const { body, headers } = req;
    const {
      customer_details,
      customer_details: { user },
    } = body;
    const validationResult = await storeRequest.validateAsync(body);

    if (headers.authorization) {
      const loggingUser: any = getAuthUserFromHeaders(headers);
      customer_details.created_by = loggingUser.id;
      validationResult.created_by = loggingUser.id;
    }

    let savedUser = customer_details.user[0];
    // if user is new then add it to the DB
    if (user[0].customOption) {
      const formattedUserData = UserService.formatUserDataFromOrder(customer_details);
      // save user data
      savedUser = await UserService.storeUser(formattedUserData);
    }

    // save data in order
    const saveOrder = await OrderService.storeOrder(savedUser, validationResult);

    return res.json(successResponse({ saveOrder }));
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

    const updateOrder = await OrderService.updateOrder(params.id, validateData);

    return res.json(successResponse(updateOrder));
  } catch (error: any) {
    next(error);
  }
};

/**
 * Delete Order from DB
 *
 * @param req Request
 * @param res Response
 * @param next any
 * @returns Response
 */
const destroy = async (req: Request, res: Response, next: any): Promise<Response> => {
  try {
    const { id } = req.params;
    const result = await OrderService.deleteOrder(id);

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
